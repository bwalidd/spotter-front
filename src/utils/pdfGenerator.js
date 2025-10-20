// PDF generation utility for ELD logs
// Creates professional PDF documents with all trip and log data

export function generatePDF(tripData, routeData, logs) {
  // Create a new window for printing
  const printWindow = window.open("", "", "height=600,width=800")

  // Build HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ELD Log Report - ${tripData.pickupLocation} to ${tripData.dropoffLocation}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        .page {
          page-break-after: always;
          margin-bottom: 40px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1e40af;
          font-size: 28px;
          margin-bottom: 5px;
        }
        .header p {
          color: #666;
          font-size: 12px;
        }
        .trip-summary {
          background: #f0f4f8;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          border-left: 4px solid #1e40af;
        }
        .trip-summary h2 {
          color: #1e40af;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .summary-item {
          background: white;
          padding: 10px;
          border-radius: 3px;
          border: 1px solid #ddd;
        }
        .summary-item label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 3px;
        }
        .summary-item value {
          display: block;
          font-size: 16px;
          font-weight: bold;
          color: #1e40af;
        }
        .log-sheet {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .log-header {
          background: #1e40af;
          color: white;
          padding: 12px;
          border-radius: 5px 5px 0 0;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 0;
        }
        .log-header h3 {
          font-size: 14px;
          margin: 0;
        }
        .log-header p {
          font-size: 12px;
          margin: 0;
        }
        .log-content {
          border: 1px solid #ddd;
          border-top: none;
          padding: 15px;
          background: white;
        }
        .hours-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 3px;
          margin-bottom: 15px;
        }
        .hour-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-size: 9px;
          font-weight: bold;
          color: white;
        }
        .hour-label {
          font-size: 8px;
          text-align: center;
          color: #666;
          margin-top: 2px;
        }
        .legend {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 15px;
          font-size: 11px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .legend-color {
          width: 15px;
          height: 15px;
          border-radius: 3px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        .stat-box {
          background: #f9fafb;
          padding: 10px;
          border-radius: 3px;
          border: 1px solid #e5e7eb;
          text-align: center;
        }
        .stat-box label {
          display: block;
          font-size: 10px;
          color: #666;
          margin-bottom: 3px;
        }
        .stat-box value {
          display: block;
          font-size: 14px;
          font-weight: bold;
          color: #1e40af;
        }
        .notes {
          background: #f9fafb;
          padding: 10px;
          border-radius: 3px;
          border: 1px solid #e5e7eb;
          font-size: 11px;
          min-height: 30px;
        }
        .notes-label {
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 5px;
          font-size: 11px;
        }
        .footer {
          text-align: center;
          font-size: 10px;
          color: #999;
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        @media print {
          body {
            padding: 0;
          }
          .page {
            margin-bottom: 0;
          }
        }
      </style>
    </head>
    <body>
      ${generateCoverPage(tripData, routeData)}
      ${logs.map((log, idx) => generateLogPage(log, tripData, routeData, idx + 1, logs.length)).join("")}
      ${generateSummaryPage(tripData, routeData, logs)}
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Trigger print dialog
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

function generateCoverPage(tripData, routeData) {
  const today = new Date().toLocaleDateString()
  return `
    <div class="page">
      <div class="header">
        <h1>ELD Log Report</h1>
        <p>Electronic Logging Device - Hours of Service Compliance</p>
      </div>
      
      <div class="trip-summary">
        <h2>Trip Information</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <label>Pickup Location</label>
            <value>${tripData.pickupLocation}</value>
          </div>
          <div class="summary-item">
            <label>Dropoff Location</label>
            <value>${tripData.dropoffLocation}</value>
          </div>
          <div class="summary-item">
            <label>Total Distance</label>
            <value>${routeData.distance} miles</value>
          </div>
          <div class="summary-item">
            <label>Est. Duration</label>
            <value>${routeData.duration} hours</value>
          </div>
        </div>
        
        <div class="summary-grid">
          <div class="summary-item">
            <label>Days Required</label>
            <value>${routeData.daysNeeded}</value>
          </div>
          <div class="summary-item">
            <label>Avg Speed</label>
            <value>${routeData.avgSpeed} mph</value>
          </div>
          <div class="summary-item">
            <label>Initial Cycle Used</label>
            <value>${tripData.cycleUsed} hours</value>
          </div>
          <div class="summary-item">
            <label>Report Date</label>
            <value>${today}</value>
          </div>
        </div>
      </div>

      <div class="trip-summary">
        <h2>Planned Stops (${routeData.stops.length})</h2>
        ${routeData.stops
          .map(
            (stop) => `
          <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 3px; border-left: 3px solid ${stop.type === "fuel" ? "#f59e0b" : "#3b82f6"};">
            <strong>${stop.type === "fuel" ? "Fuel Stop" : "Rest Break"}</strong> - ${stop.location} (Day ${stop.day}, ${stop.time}h)
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="footer">
        <p>This report is generated by ELD Log Generator and is compliant with FMCSA Hours of Service regulations.</p>
      </div>
    </div>
  `
}

function generateLogPage(log, tripData, routeData, pageNum, totalPages) {
  const activityColors = {
    "off-duty": "#64748b",
    sleeper: "#3b82f6",
    driving: "#ff6b35",
    "on-duty": "#f59e0b",
  }

  const stats = calculateLogStats(log.activities)

  return `
    <div class="page">
      <div class="log-sheet">
        <div class="log-header">
          <div>
            <h3>Day ${log.day}</h3>
            <p>${log.date}</p>
          </div>
          <div>
            <h3>Trip Progress</h3>
            <p>Page ${pageNum} of ${totalPages + 1}</p>
          </div>
          <div>
            <h3>Route</h3>
            <p>${tripData.pickupLocation} → ${tripData.dropoffLocation}</p>
          </div>
        </div>
        
        <div class="log-content">
          <div class="hours-grid">
            ${Array(24)
              .fill(null)
              .map((_, hour) => {
                const activity = log.activities[hour]
                const color = activityColors[activity]
                return `
                  <div>
                    <div class="hour-cell" style="background-color: ${color};">${hour}</div>
                    <div class="hour-label">${hour}</div>
                  </div>
                `
              })
              .join("")}
          </div>

          <div class="legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #64748b;"></div>
              <span>Off Duty</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #3b82f6;"></div>
              <span>Sleeper</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #ff6b35;"></div>
              <span>Driving</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #f59e0b;"></div>
              <span>On Duty</span>
            </div>
          </div>

          <div class="stats">
            <div class="stat-box">
              <label>Driving Hours</label>
              <value>${stats.driving}</value>
            </div>
            <div class="stat-box">
              <label>On Duty Hours</label>
              <value>${stats.onDuty}</value>
            </div>
            <div class="stat-box">
              <label>Sleeper Hours</label>
              <value>${stats.sleeper}</value>
            </div>
            <div class="stat-box">
              <label>Off Duty Hours</label>
              <value>${stats.offDuty}</value>
            </div>
          </div>

          ${
            log.notes
              ? `
            <div class="notes">
              <div class="notes-label">Notes:</div>
              <div>${log.notes}</div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `
}

function generateSummaryPage(tripData, routeData, logs) {
  const totalStats = logs.reduce(
    (acc, log) => {
      const stats = calculateLogStats(log.activities)
      return {
        driving: acc.driving + stats.driving,
        onDuty: acc.onDuty + stats.onDuty,
        sleeper: acc.sleeper + stats.sleeper,
        offDuty: acc.offDuty + stats.offDuty,
      }
    },
    { driving: 0, onDuty: 0, sleeper: 0, offDuty: 0 },
  )

  const totalCycleUsed = tripData.cycleUsed + totalStats.driving

  return `
    <div class="page">
      <div class="header">
        <h1>Trip Summary</h1>
        <p>Complete Hours of Service Report</p>
      </div>

      <div class="trip-summary">
        <h2>Total Hours Summary</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <label>Total Driving Hours</label>
            <value>${totalStats.driving}</value>
          </div>
          <div class="summary-item">
            <label>Total On-Duty Hours</label>
            <value>${totalStats.onDuty}</value>
          </div>
          <div class="summary-item">
            <label>Total Sleeper Hours</label>
            <value>${totalStats.sleeper}</value>
          </div>
          <div class="summary-item">
            <label>Total Off-Duty Hours</label>
            <value>${totalStats.offDuty}</value>
          </div>
        </div>
      </div>

      <div class="trip-summary">
        <h2>70-Hour Cycle Status</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <label>Initial Cycle Used</label>
            <value>${tripData.cycleUsed}h</value>
          </div>
          <div class="summary-item">
            <label>Driving Hours This Trip</label>
            <value>${totalStats.driving}h</value>
          </div>
          <div class="summary-item">
            <label>Total Cycle Used</label>
            <value>${totalCycleUsed}h</value>
          </div>
          <div class="summary-item">
            <label>Remaining in Cycle</label>
            <value>${Math.max(0, 70 - totalCycleUsed)}h</value>
          </div>
        </div>
      </div>

      <div class="trip-summary">
        <h2>Trip Details</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <label>From</label>
            <value>${tripData.pickupLocation}</value>
          </div>
          <div class="summary-item">
            <label>To</label>
            <value>${tripData.dropoffLocation}</value>
          </div>
          <div class="summary-item">
            <label>Distance</label>
            <value>${routeData.distance} mi</value>
          </div>
          <div class="summary-item">
            <label>Days</label>
            <value>${logs.length}</value>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>This report is for compliance with FMCSA Hours of Service regulations.</p>
      </div>
    </div>
  `
}

function calculateLogStats(activities) {
  return {
    driving: activities.filter((a) => a === "driving").length,
    onDuty: activities.filter((a) => a === "on-duty").length,
    sleeper: activities.filter((a) => a === "sleeper").length,
    offDuty: activities.filter((a) => a === "off-duty").length,
  }
}
