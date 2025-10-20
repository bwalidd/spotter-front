"use client";

import { useState, useEffect } from "react";
import DrawableLogSheet from "./drawable-log-sheet";
import {
  generateDefaultLog,
  calculateCycleUsage,
} from "@/utils/eld-calculations";
import { generatePDF } from "@/utils/pdf-generator";
import { saveTripAndLogs } from "@/utils/api-service";
import { Trash2 } from "lucide-react";

interface LogSheetGeneratorProps {
  tripData: any;
  routeData: any;
}

export default function LogSheetGenerator({
  tripData,
  routeData,
}: LogSheetGeneratorProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [cycleUsage, setCycleUsage] = useState(tripData?.cycleUsed || 0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (tripData && routeData) {
      generateLogs();
    }
  }, [tripData, routeData]);

  const generateLogs = () => {
    const daysNeeded = routeData?.daysNeeded || 1;
    const totalDrivingHours = routeData?.duration || 0;
    const drivingPerDay = totalDrivingHours / daysNeeded;
    const newLogs = [];

    for (let i = 0; i < daysNeeded; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const isoDate = date.toISOString().slice(0, 10);
      const log = generateDefaultLog(i + 1, isoDate, drivingPerDay);
      newLogs.push(log);
    }

    setLogs(newLogs);
    updateCycleUsage(newLogs);
  };

  const handleLogUpdate = (updatedLog: any) => {
    const updatedLogs = logs.map((log) =>
      log.day === updatedLog.day ? updatedLog : log
    );
    setLogs(updatedLogs);
    updateCycleUsage(updatedLogs);
  };

  const updateCycleUsage = (currentLogs: any[]) => {
    const usage = calculateCycleUsage(currentLogs, tripData?.cycleUsed || 0);
    setCycleUsage(Number.isNaN(usage) ? tripData?.cycleUsed || 0 : usage);
  };

  const [isSaving, setIsSaving] = useState(false);

  // ---- Validation helpers (70h/8d & pickup/dropoff on-duty limit) ----
  const getDrivingHoursFromLog = (log: any): number => {
    const acts: string[] = log?.activities || [];
    const drivingSegments = acts.filter((a) => a === "driving").length;
    const divisor = acts.length > 24 ? 4 : 1; // 15-min segments => divide by 4
    return drivingSegments / divisor;
  };

  const parseTimeToMinutes = (t: string): number => {
    const m = t.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!m) return 0;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ampm = m[3]?.toUpperCase();
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h * 60 + min;
  };

  const getPickupDropoffOnDutyMinutesFromRemarks = (log: any): number => {
    const remarks: string[] = log?.remarks || [];
    let total = 0;
    for (const r of remarks) {
      const hasOnDuty = /on duty/i.test(r);
      const hasPickupOrDrop = /(pick\s*-?\s*up|pickup|drop\s*-?\s*off|dropoff)/i.test(r);
      const timeMatch = r.match(/(\d{1,2}:\d{2}(?:\s*[AP]M)?)\s*-\s*(\d{1,2}:\d{2}(?:\s*[AP]M)?)/i);
      if (hasOnDuty && hasPickupOrDrop && timeMatch) {
        const start = parseTimeToMinutes(timeMatch[1]);
        const end = parseTimeToMinutes(timeMatch[2]);
        if (end > start) total += end - start;
      }
    }
    return total;
  };

  const validateBeforeSave = (): boolean => {
    const lastEight = logs.slice(Math.max(0, logs.length - 8));

    // 70 hours driving across last 8 days (per user request)
    const totalDriving = lastEight.reduce(
      (sum, log) => sum + getDrivingHoursFromLog(log),
      0
    );
    const priorUsed = Number(tripData?.cycleUsed || 0);
    const effectiveTotal = totalDriving + priorUsed;
    if (effectiveTotal > 70) {
      alert(
        `Driver exceeds 70 hours of driving in 8 days (${effectiveTotal.toFixed(
          1
        )}h incl. prior ${priorUsed.toFixed(1)}h). Adjust logs before saving.`
      );
      return false;
    }

    // Pickup/Dropoff On Duty (Not Driving) remarks must not exceed 1 hour per day
    const hasPickupDropoffViolation = lastEight.some(
      (log) => getPickupDropoffOnDutyMinutesFromRemarks(log) > 60
    );
    if (hasPickupDropoffViolation) {
      alert(
        "Pickup/Dropoff On Duty (Not Driving) time exceeds 1 hour on at least one day. Please adjust remarks/time."
      );
      return false;
    }

    return true;
  };

  const handleSaveAndDownloadPDF = (forceNewTrip = false) => {
    // Run validations before generating/saving
    if (!validateBeforeSave()) {
      return;
    }

    setIsExporting(true);
    setIsSaving(true);

    // Generate PDF immediately to prevent UI freezing
    try {
      generatePDF(tripData, routeData, logs);
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError);
      alert("Error occurred while generating PDF. Please try again.");
      setIsExporting(false);
      setIsSaving(false);
      return;
    }

    // Then save to backend in a non-blocking way
    saveTripAndLogs(tripData, routeData, logs, forceNewTrip)
      .then((saveResult) => {
        if (saveResult.success) {
          console.log(
            "Trip data saved successfully with ID:",
            saveResult.tripId
          );
        } else {
          console.error("Failed to save trip data:", saveResult.error);
          alert(
            "PDF generated successfully, but there was an issue saving to the server. Your data may not be retrievable later."
          );
        }
      })
      .catch((error) => {
        console.error("Error saving trip data:", error);
        alert(
          "PDF generated successfully, but there was an error saving to the server."
        );
      })
      .finally(() => {
        setIsExporting(false);
        setIsSaving(false);
      });
  };

  const handleCreateNewTrip = () => {
    if (
      window.confirm(
        "Are you sure you want to create a new trip? This will save the current data as a new trip."
      )
    ) {
      handleSaveAndDownloadPDF(true);
    }
  };

  const handleAddDay = () => {
    const newDay = logs.length + 1;
    const date = new Date(Date.now() + logs.length * 24 * 60 * 60 * 1000);
    const isoDate = date.toISOString().slice(0, 10);
    const newLog = generateDefaultLog(newDay, isoDate, 0);
    setLogs([...logs, newLog]);
  };

  const handleRemoveDay = (dayToRemove: number) => {
    const updatedLogs = logs
      .filter((log) => log.day !== dayToRemove)
      .map((log, idx) => ({
        ...log,
        day: idx + 1,
      }));
    setLogs(updatedLogs);
    updateCycleUsage(updatedLogs);
  };

  const handleResetLogs = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all logs? This cannot be undone."
      )
    ) {
      generateLogs();
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div
        className="p-6 rounded-lg text-center"
        style={{
          backgroundColor: "var(--color-primary)",
          border: "2px solid var(--color-accent)",
        }}
      >
        <p style={{ color: "var(--color-neutral-gray)" }}>
          Generating log sheets...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 border border-slate-700 rounded-lg p-6">
      {/* Cycle Usage Summary */}
      <div className="p-4 rounded ">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--color-neutral-gray)" }}
            >
              70-Hour Cycle Used
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--color-accent)" }}
            >
              {cycleUsage.toFixed(1)}h
            </p>
          </div>
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--color-neutral-gray)" }}
            >
              Remaining
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--color-accent)" }}
            >
              {Math.max(0, 70 - cycleUsage).toFixed(1)}h
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2 ">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(100, (cycleUsage / 70) * 100)}%`,
              backgroundColor:
                cycleUsage > 0 ? "#f87d30f0" : "var(--color-accent)",
            }}
          ></div>
        </div>
      </div>

      {logs.map((log, idx) => (
        <div key={idx} className="relative">
          <DrawableLogSheet
            log={log}
            tripData={routeData}
            onUpdate={handleLogUpdate}
          />
          {logs.length > 1 && (
            <button
              onClick={() => handleRemoveDay(log.day)}
              className="absolute top-4 right-4 px-2 py-1 text-xs rounded transition-all mt-5"
              style={{
                backgroundColor: "var(--color-error)",
                color: "white",
              }}
            >
              <Trash2
                className="inline-block w-5 h-5 mt-3"
                style={{ color: "red" }}
              />
            </button>
          )}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={handleAddDay}
          className="py-3 rounded font-bold transition-all hover:opacity-90 bg-blue-900 border border-orange-500"
          style={{
            color: "white",
          }}
        >
          Add Day
        </button>
        <button
          onClick={handleResetLogs}
          className="py-3 rounded font-bold transition-all hover:opacity-90 bg-blue-900 border border-orange-500"
          style={{
            color: "white",
          }}
        >
          Reset Logs
        </button>
      </div>

      {/* Save Buttons */}
      <div className="grid grid-cols-1 gap-4">
        {/* <button
          onClick={() => handleSaveAndDownloadPDF(false)}
          disabled={isExporting || isSaving}
          className="py-3 rounded font-bold transition-all hover:opacity-90 bg-blue-900 border border-orange-500"
          style={{
            color: "white",
          }}
        >
          {isExporting ? "Generating..." : isSaving ? "Saving..." : "Update & Download PDF"}
        </button> */}
        <button
          onClick={handleCreateNewTrip}
          disabled={isExporting || isSaving}
          className="py-3 rounded font-bold transition-all hover:opacity-90 bg-transparent hover:bg-transparent hover:text-white border border-orange-500 hover:border-orange-700 text-orange-500"
        >
          Save Trip & Download PDF
        </button>
      </div>
    </div>
  );
}
