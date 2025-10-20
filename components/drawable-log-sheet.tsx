// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { ACTIVITY_COLORS, calculateDailyStats } from "@/utils/eld-calculations"

// interface DrawableLogSheetProps {
//   log: any
//   tripData: any
//   onUpdate: (log: any) => void
// }

// interface DrawingState {
//   isDrawing: boolean
//   startX: number
//   startY: number
//   currentActivityType: string
// }

// export default function DrawableLogSheet({ log, tripData, onUpdate }: DrawableLogSheetProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [activities, setActivities] = useState(log.activities || Array(24).fill("off-duty"))
//   const [notes, setNotes] = useState(log.notes || "")
//   const [showStats, setShowStats] = useState(false)
//   const [drawingState, setDrawingState] = useState<DrawingState>({
//     isDrawing: false,
//     startX: 0,
//     startY: 0,
//     currentActivityType: "driving",
//   })
//   const [remarks, setRemarks] = useState(log.remarks || [])
//   const [newRemark, setNewRemark] = useState("")

//   const CANVAS_WIDTH = 1200
//   const CANVAS_HEIGHT = 300
//   const HOUR_WIDTH = CANVAS_WIDTH / 24
//   const ROW_HEIGHT = CANVAS_HEIGHT / 4
//   const GRID_LINES_PER_HOUR = 4 // 15-minute increments

//   useEffect(() => {
//     if (!canvasRef.current) return
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Clear canvas
//     ctx.fillStyle = "#ffffff"
//     ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

//     // Draw grid
//     ctx.strokeStyle = "#e0e0e0"
//     ctx.lineWidth = 0.5

//     // Vertical lines (hours)
//     for (let i = 0; i <= 24; i++) {
//       const x = (i / 24) * CANVAS_WIDTH
//       ctx.beginPath()
//       ctx.moveTo(x, 0)
//       ctx.lineTo(x, CANVAS_HEIGHT)
//       ctx.stroke()
//     }

//     // Horizontal lines (activity rows)
//     for (let i = 0; i <= 4; i++) {
//       const y = (i / 4) * CANVAS_HEIGHT
//       ctx.beginPath()
//       ctx.moveTo(0, y)
//       ctx.lineTo(CANVAS_WIDTH, y)
//       ctx.stroke()
//     }

//     // Draw minute tick marks
//     ctx.strokeStyle = "#d0d0d0"
//     ctx.lineWidth = 0.3
//     for (let hour = 0; hour < 24; hour++) {
//       for (let quarter = 1; quarter < GRID_LINES_PER_HOUR; quarter++) {
//         const x = ((hour + quarter / GRID_LINES_PER_HOUR) / 24) * CANVAS_WIDTH
//         ctx.beginPath()
//         ctx.moveTo(x, 0)
//         ctx.lineTo(x, CANVAS_HEIGHT)
//         ctx.stroke()
//       }
//     }

//     // Draw activity lines based on current activities
//     drawActivityLines(ctx)
//   }, [activities])

//   const drawActivityLines = (ctx: CanvasRenderingContext2D) => {
//     const activityRows: { [key: string]: number } = {
//       "off-duty": 0,
//       sleeper: 1,
//       driving: 2,
//       "on-duty": 3,
//     }

//     // Group consecutive hours of same activity
//     let currentActivity = activities[0]
//     let startHour = 0

//     for (let hour = 1; hour <= 24; hour++) {
//       const nextActivity = hour < 24 ? activities[hour] : null

//       if (nextActivity !== currentActivity || hour === 24) {
//         // Draw line for this activity segment
//         const rowIndex = activityRows[currentActivity]
//         const y = rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2

//         const x1 = (startHour / 24) * CANVAS_WIDTH
//         const x2 = (hour / 24) * CANVAS_WIDTH

//         // Draw thick line
//         ctx.strokeStyle = ACTIVITY_COLORS[currentActivity] || "#000000"
//         ctx.lineWidth = 8
//         ctx.lineCap = "round"
//         ctx.lineJoin = "round"

//         ctx.beginPath()
//         ctx.moveTo(x1, y)
//         ctx.lineTo(x2, y)
//         ctx.stroke()

//         // Draw red dots at start and end
//         ctx.fillStyle = "#ff0000"
//         ctx.beginPath()
//         ctx.arc(x1, y, 5, 0, Math.PI * 2)
//         ctx.fill()

//         if (hour === 24 || nextActivity !== currentActivity) {
//           ctx.beginPath()
//           ctx.arc(x2, y, 5, 0, Math.PI * 2)
//           ctx.fill()
//         }

//         if (nextActivity !== currentActivity) {
//           currentActivity = nextActivity || "off-duty"
//           startHour = hour
//         }
//       }
//     }
//   }

//   const getActivityAtPosition = (x: number, y: number): string => {
//     const rowIndex = Math.floor((y / CANVAS_HEIGHT) * 4)
//     const activityRows = ["off-duty", "sleeper", "driving", "on-duty"]
//     return activityRows[Math.min(3, rowIndex)]
//   }

//   const getHourFromX = (x: number): number => {
//     return Math.floor((x / CANVAS_WIDTH) * 24)
//   }

//   const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const rect = canvas.getBoundingClientRect()
//     const x = e.clientX - rect.left
//     const y = e.clientY - rect.top

//     const activityType = getActivityAtPosition(x, y)

//     setDrawingState({
//       isDrawing: true,
//       startX: x,
//       startY: y,
//       currentActivityType: activityType,
//     })
//   }

//   const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!drawingState.isDrawing) return

//     const canvas = canvasRef.current
//     if (!canvas) return

//     const rect = canvas.getBoundingClientRect()
//     const x = e.clientX - rect.left

//     // Redraw canvas
//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Redraw everything
//     ctx.fillStyle = "#ffffff"
//     ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

//     // Redraw grid
//     ctx.strokeStyle = "#e0e0e0"
//     ctx.lineWidth = 0.5

//     for (let i = 0; i <= 24; i++) {
//       const px = (i / 24) * CANVAS_WIDTH
//       ctx.beginPath()
//       ctx.moveTo(px, 0)
//       ctx.lineTo(px, CANVAS_HEIGHT)
//       ctx.stroke()
//     }

//     for (let i = 0; i <= 4; i++) {
//       const py = (i / 4) * CANVAS_HEIGHT
//       ctx.beginPath()
//       ctx.moveTo(0, py)
//       ctx.lineTo(CANVAS_WIDTH, py)
//       ctx.stroke()
//     }

//     // Draw minute marks
//     ctx.strokeStyle = "#d0d0d0"
//     ctx.lineWidth = 0.3
//     for (let hour = 0; hour < 24; hour++) {
//       for (let quarter = 1; quarter < GRID_LINES_PER_HOUR; quarter++) {
//         const px = ((hour + quarter / GRID_LINES_PER_HOUR) / 24) * CANVAS_WIDTH
//         ctx.beginPath()
//         ctx.moveTo(px, 0)
//         ctx.lineTo(px, CANVAS_HEIGHT)
//         ctx.stroke()
//       }
//     }

//     // Draw existing activity lines
//     drawActivityLines(ctx)

//     // Draw preview line being drawn
//     const y = drawingState.startY
//     ctx.strokeStyle = ACTIVITY_COLORS[drawingState.currentActivityType] || "#000000"
//     ctx.lineWidth = 8
//     ctx.lineCap = "round"
//     ctx.lineJoin = "round"
//     ctx.globalAlpha = 0.7

//     ctx.beginPath()
//     ctx.moveTo(drawingState.startX, y)
//     ctx.lineTo(x, y)
//     ctx.stroke()

//     ctx.globalAlpha = 1
//   }

//   const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!drawingState.isDrawing) return

//     const canvas = canvasRef.current
//     if (!canvas) return

//     const rect = canvas.getBoundingClientRect()
//     const endX = e.clientX - rect.left

//     const startHour = getHourFromX(drawingState.startX)
//     const endHour = getHourFromX(endX)

//     if (startHour !== endHour) {
//       const newActivities = [...activities]
//       const minHour = Math.min(startHour, endHour)
//       const maxHour = Math.max(startHour, endHour)

//       for (let i = minHour; i < maxHour && i < 24; i++) {
//         newActivities[i] = drawingState.currentActivityType
//       }

//       setActivities(newActivities)
      
//       // Add automatic remark for the activity change
//       if (drawingState.currentActivityType !== 'driving') {
//         // Format time range for the remark
//         const startTime = formatHourToTime(minHour)
//         const endTime = formatHourToTime(maxHour)
//         const activityLabel = {
//           'off-duty': 'Off Duty',
//           'sleeper': 'Sleeper Berth',
//           'on-duty': 'On Duty (Not Driving)'
//         }[drawingState.currentActivityType] || drawingState.currentActivityType
        
//         // Set the new remark with time information
//         setNewRemark(`${startTime} - ${endTime}: ${activityLabel} - `)
        
//         // Focus on the remark input after a short delay
//         setTimeout(() => {
//           const remarkInput = document.getElementById('remark-input')
//           if (remarkInput) {
//             remarkInput.focus()
//           }
//         }, 100)
//       }
      
//       if (onUpdate) {
//         onUpdate({
//           ...log,
//           activities: newActivities,
//           notes,
//           remarks,
//         })
//       }
//     }

//     setDrawingState({
//       ...drawingState,
//       isDrawing: false,
//     })
//   }
  
//   // Helper function to format hour to time string (e.g., 14 -> "2:00 PM")
//   const formatHourToTime = (hour: number): string => {
//     const ampm = hour >= 12 ? 'PM' : 'AM'
//     const hourDisplay = hour % 12 || 12
//     return `${hourDisplay}:00 ${ampm}`
//   }

//   const handleAddRemark = () => {
//     if (newRemark.trim()) {
//       const updatedRemarks = [...remarks, newRemark]
//       setRemarks(updatedRemarks)
//       setNewRemark("")
//       if (onUpdate) {
//         onUpdate({
//           ...log,
//           activities,
//           notes,
//           remarks: updatedRemarks,
//         })
//       }
//     }
//   }

//   const handleRemoveRemark = (index: number) => {
//     const updatedRemarks = remarks.filter((_, i) => i !== index)
//     setRemarks(updatedRemarks)
//     if (onUpdate) {
//       onUpdate({
//         ...log,
//         activities,
//         notes,
//         remarks: updatedRemarks,
//       })
//     }
//   }

//   const stats = calculateDailyStats(activities)
//   const hasViolations = stats.violations.length > 0

//   return (
//     <div
//       className="rounded-lg p-6 "
//       style={{
//         backgroundColor: "var(--color-primary)",
//         border: hasViolations ? "2px solid var(--color-error)" : "2px solid var(--color-accent)",
//       }}
//     >
//       {/* Header */}
//       <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b" style={{ borderColor: "var(--color-accent)" }}>
//         <div>
//           <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
//             Date
//           </p>
//           <p className="font-bold" style={{ color: "var(--color-accent)" }}>
//             {log.date}
//           </p>
//         </div>
//         <div>
//           <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
//             Day
//           </p>
//           <p className="font-bold" style={{ color: "var(--color-accent)" }}>
//             {log.day} of {tripData?.daysNeeded || "?"}
//           </p>
//         </div>
//         <div className="text-right">
//           <button
//             onClick={() => setShowStats(!showStats)}
//             className="text-xs px-3 py-1 rounded transition-all"
//             style={{
//               backgroundColor: "var(--color-accent)",
//               color: "var(--color-neutral-dark)",
//             }}
//           >
//             {showStats ? "Hide" : "Show"} Stats
//           </button>
//         </div>
//       </div>

//       {/* Statistics */}
//       {showStats && (
//         <div className="mb-6 p-4 rounded" style={{ backgroundColor: "var(--color-neutral-light)" }}>
//           <div className="grid grid-cols-4 gap-2 mb-3">
//             <div>
//               <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
//                 Driving
//               </p>
//               <p className="font-bold" style={{ color: "var(--color-accent)" }}>
//                 {stats.driving}h
//               </p>
//             </div>
//             <div>
//               <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
//                 On Duty
//               </p>
//               <p className="font-bold" style={{ color: "var(--color-accent)" }}>
//                 {stats.onDuty}h
//               </p>
//             </div>
//             <div>
//               <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
//                 Sleeper
//               </p>
//               <p className="font-bold" style={{ color: "var(--color-accent)" }}>
//                 {stats.sleeper}h
//               </p>
//             </div>
//             <div>
//               <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
//                 Off Duty
//               </p>
//               <p className="font-bold" style={{ color: "var(--color-accent)" }}>
//                 {stats.offDuty}h
//               </p>
//             </div>
//           </div>

//           {stats.violations.length > 0 && (
//             <div className="p-2 rounded" style={{ backgroundColor: "var(--color-error)", opacity: 0.2 }}>
//               <p className="text-xs font-bold" style={{ color: "var(--color-error)" }}>
//                 Violations:
//               </p>
//               {stats.violations.map((violation: string, idx: number) => (
//                 <p key={idx} className="text-xs" style={{ color: "var(--color-error)" }}>
//                   • {violation}
//                 </p>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Drawable Canvas */}
//       <div className="mb-6">
//         <p className="text-sm font-bold mb-3" style={{ color: "var(--color-accent)" }}>
//           Hours of Service (Click and drag to draw activities)
//         </p>

//         <div className="overflow-x-auto border rounded-t" style={{ borderColor: "var(--color-accent)" }}>
//           <div style={{ width: CANVAS_WIDTH, display: "flex", backgroundColor: "var(--color-neutral-light)" }}>
//             {/* Left label space */}
//             <div style={{ width: 0 }}></div>

//             {/* Timeline hours */}
//             <div
//               style={{
//                 position: "relative",
//                 width: CANVAS_WIDTH,
//                 height: "28px",
//                 backgroundColor: "var(--color-neutral-light)",
//               }}
//             >
//               {Array.from({ length: 25 }).map((_, i) => {
//                 // Label for hour marks (0–24)
//                 let label = i === 0 ? "0" : i === 12 ? "12" : i < 12 ? i.toString() : (i - 12).toString()

//                 return (
//                   <div
//                     key={i}
//                     style={{
//                       position: "absolute",
//                       left: `${(i / 24) * 100}%`,
//                       transform: i === 0 ? "translateX(0)" : "translateX(-50%)",
//                       textAlign: "center",
//                       fontSize: "11px",
//                       fontWeight: "600",
//                       color: "var(--color-neutral-dark)",
//                     }}
//                   >
//                     {label}
//                   </div>
//                 )
//               })}
//             </div>

//           </div>
//         </div>

//         <div className="overflow-x-auto border rounded-b" style={{ borderColor: "var(--color-accent)" }}>
//           <canvas
//             ref={canvasRef}
//             width={CANVAS_WIDTH}
//             height={CANVAS_HEIGHT}
//             onMouseDown={handleCanvasMouseDown}
//             onMouseMove={handleCanvasMouseMove}
//             onMouseUp={handleCanvasMouseUp}
//             onMouseLeave={handleCanvasMouseUp}
//             className="cursor-crosshair"
//             style={{ display: "block", minWidth: "100%" }}
//           />
//         </div>

//         {/* Row Labels */}
        // <div className="mt-2 text-xs space-y-4">
        //   <div className="flex items-center gap-4">
        //     <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["off-duty"] }}></div>
        //     <span style={{ color: "var(--color-neutral-light)" }}>1: OFF DUTY</span>
        //   </div>
        //   <div className="flex items-center gap-4">
        //     <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["sleeper"] }}></div>
        //     <span style={{ color: "var(--color-neutral-light)" }}>2: SLEEPER BERTH</span>
        //   </div>
        //   <div className="flex items-center gap-4">
        //     <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["driving"] }}></div>
        //     <span style={{ color: "var(--color-neutral-light)" }}>3: DRIVING</span>
        //   </div>
        //   <div className="flex items-center gap-4">
        //     <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["on-duty"] }}></div>
        //     <span style={{ color: "var(--color-neutral-light)" }}>4: ON DUTY (NOT DRIVING)</span>
        //   </div>
        // </div>
      // </div>

//       {/* Remarks Section */}
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-3">
//           <p className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
//             Remarks
//           </p>
//           <p className="text-xs italic" style={{ color: "var(--color-neutral-gray)" }}>
//             Draw on Off Duty, Sleeper Berth or On Duty to auto-generate remarks
//           </p>
//         </div>
//         <div className="flex gap-2 mb-3">
//           <input
//             id="remark-input"
//             type="text"
//             value={newRemark}
//             onChange={(e) => setNewRemark(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
//             placeholder="Draw on Off Duty, Sleeper Berth or On Duty to auto-generate a remark..."
//             className="flex-1 px-3 py-2 rounded text-sm"
//             style={{
//               backgroundColor: "var(--color-neutral-light)",
//               color: "var(--color-neutral-dark)",
//               border: "1px solid var(--color-accent)",
//             }}
//           />
//           <button
//             onClick={handleAddRemark}
//             className="px-4 py-2 rounded font-semibold transition-all"
//             style={{
//               backgroundColor: "var(--color-accent)",
//               color: "var(--color-neutral-dark)",
//             }}
//           >
//             Add
//           </button>
//         </div>

//         {remarks.length > 0 && (
//           <div className="space-y-2">
//             {remarks.map((remark: string, idx: number) => (
//               <div
//                 key={idx}
//                 className="flex items-center justify-between p-2 rounded"
//                 style={{ backgroundColor: "var(--color-neutral-light)" }}
//               >
//                 <span className="text-sm" style={{ color: "var(--color-neutral-dark)" }}>
//                   {remark}
//                 </span>
//                 <button
//                   onClick={() => handleRemoveRemark(idx)}
//                   className="text-xs px-2 py-1 rounded transition-all"
//                   style={{
//                     backgroundColor: "var(--color-error)",
//                     color: "white",
//                   }}
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Notes */}
//       <div>
//         <label className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>
//           Additional Notes
//         </label>
//         <textarea
//           value={notes}
//           onChange={(e) => {
//             setNotes(e.target.value)
//             if (onUpdate) {
//               onUpdate({
//                 ...log,
//                 activities,
//                 notes: e.target.value,
//                 remarks,
//               })
//             }
//           }}
//           placeholder="Add any additional notes for this day..."
//           className="w-full mt-2 p-2 rounded text-sm"
//           style={{
//             backgroundColor: "var(--color-neutral-light)",
//             color: "var(--color-neutral-dark)",
//             border: "1px solid var(--color-accent)",
//           }}
//           rows={2}
//         />
//       </div>
//     </div>
//   )
// }



//----------------------------------------------------


"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ACTIVITY_COLORS, calculateDailyStats } from "@/utils/eld-calculations"
import { Trash2 } from "lucide-react"

interface DrawableLogSheetProps {
  log: any
  tripData: any
  onUpdate: (log: any) => void
}

interface DrawingState {
  isDrawing: boolean
  startX: number
  startY: number
  currentActivityType: string
}

export default function DrawableLogSheet({ log, tripData, onUpdate }: DrawableLogSheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ✅ 15-minute increments (96 per day)
  const INCREMENTS_PER_HOUR = 4
  const TOTAL_SEGMENTS = 24 * INCREMENTS_PER_HOUR // 96 segments

  const [activities, setActivities] = useState(
    log.activities || Array(TOTAL_SEGMENTS).fill("off-duty")
  )
  const [notes, setNotes] = useState(log.notes || "")
  const [showStats, setShowStats] = useState(false)
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentActivityType: "driving",
  })
  const [remarks, setRemarks] = useState(log.remarks || [])
  const [newRemark, setNewRemark] = useState("")

  const CANVAS_WIDTH = 1200
  const CANVAS_HEIGHT = 300
  const ROW_HEIGHT = CANVAS_HEIGHT / 4

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw grid
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 0.5

    // Hour grid lines
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * CANVAS_WIDTH
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, CANVAS_HEIGHT)
      ctx.stroke()
    }

    // Horizontal activity rows
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * CANVAS_HEIGHT
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_WIDTH, y)
      ctx.stroke()
    }

    // Quarter-hour marks
    ctx.strokeStyle = "#d0d0d0"
    ctx.lineWidth = 0.3
    for (let hour = 0; hour < 24; hour++) {
      for (let quarter = 1; quarter < INCREMENTS_PER_HOUR; quarter++) {
        const x = ((hour + quarter / INCREMENTS_PER_HOUR) / 24) * CANVAS_WIDTH
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_HEIGHT)
        ctx.stroke()
      }
    }

    // Draw activity lines
    drawActivityLines(ctx)
  }, [activities])

  const drawActivityLines = (ctx: CanvasRenderingContext2D) => {
    const activityRows: { [key: string]: number } = {
      "off-duty": 0,
      sleeper: 1,
      driving: 2,
      "on-duty": 3,
    }

    let currentActivity = activities[0]
    let startSegment = 0

    for (let i = 1; i <= TOTAL_SEGMENTS; i++) {
      const nextActivity = i < TOTAL_SEGMENTS ? activities[i] : null

      if (nextActivity !== currentActivity || i === TOTAL_SEGMENTS) {
        const rowIndex = activityRows[currentActivity]
        const y = rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2

        const x1 = (startSegment / TOTAL_SEGMENTS) * CANVAS_WIDTH
        const x2 = (i / TOTAL_SEGMENTS) * CANVAS_WIDTH

        ctx.strokeStyle = ACTIVITY_COLORS[currentActivity] || "#000000"
        ctx.lineWidth = 8
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.stroke()

        ctx.fillStyle = "#ff0000"
        ctx.beginPath()
        ctx.arc(x1, y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x2, y, 4, 0, Math.PI * 2)
        ctx.fill()

        currentActivity = nextActivity || "off-duty"
        startSegment = i
      }
    }
  }

  const getActivityAtPosition = (x: number, y: number): string => {
    const rowIndex = Math.floor((y / CANVAS_HEIGHT) * 4)
    const activityRows = ["off-duty", "sleeper", "driving", "on-duty"]
    return activityRows[Math.min(3, rowIndex)]
  }

  const getSegmentFromX = (x: number): number => {
    const segment = Math.floor((x / CANVAS_WIDTH) * TOTAL_SEGMENTS)
    return Math.max(0, Math.min(segment, TOTAL_SEGMENTS - 1))
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const activityType = getActivityAtPosition(x, y)
    setDrawingState({ isDrawing: true, startX: x, startY: y, currentActivityType: activityType })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    // Redraw grid
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 24; i++) {
      const px = (i / 24) * CANVAS_WIDTH
      ctx.beginPath()
      ctx.moveTo(px, 0)
      ctx.lineTo(px, CANVAS_HEIGHT)
      ctx.stroke()
    }
    for (let i = 0; i <= 4; i++) {
      const py = (i / 4) * CANVAS_HEIGHT
      ctx.beginPath()
      ctx.moveTo(0, py)
      ctx.lineTo(CANVAS_WIDTH, py)
      ctx.stroke()
    }
    ctx.strokeStyle = "#d0d0d0"
    ctx.lineWidth = 0.3
    for (let hour = 0; hour < 24; hour++) {
      for (let quarter = 1; quarter < INCREMENTS_PER_HOUR; quarter++) {
        const px = ((hour + quarter / INCREMENTS_PER_HOUR) / 24) * CANVAS_WIDTH
        ctx.beginPath()
        ctx.moveTo(px, 0)
        ctx.lineTo(px, CANVAS_HEIGHT)
        ctx.stroke()
      }
    }
    drawActivityLines(ctx)

    // Preview current line
    const y = drawingState.startY
    ctx.strokeStyle = ACTIVITY_COLORS[drawingState.currentActivityType] || "#000000"
    ctx.lineWidth = 8
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.moveTo(drawingState.startX, y)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  const formatSegmentToTime = (segment: number): string => {
    const totalMinutes = segment * (60 / INCREMENTS_PER_HOUR)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const ampm = hours >= 12 ? "PM" : "AM"
    const hourDisplay = hours % 12 || 12
    const minuteDisplay = minutes.toString().padStart(2, "0")
    return `${hourDisplay}:${minuteDisplay} ${ampm}`
  }

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const endX = e.clientX - rect.left
    const startSegment = getSegmentFromX(drawingState.startX)
    const endSegment = getSegmentFromX(endX)

    if (startSegment !== endSegment) {
      const newActivities = [...activities]
      const minSeg = Math.min(startSegment, endSegment)
      const maxSeg = Math.max(startSegment, endSegment)

      for (let i = minSeg; i < maxSeg && i < TOTAL_SEGMENTS; i++) {
        newActivities[i] = drawingState.currentActivityType
      }

      setActivities(newActivities)

      if (drawingState.currentActivityType !== "driving") {
        const startTime = formatSegmentToTime(minSeg)
        const endTime = formatSegmentToTime(maxSeg)
        const activityLabel =
          {
            "off-duty": "Off Duty",
            sleeper: "Sleeper Berth",
            "on-duty": "On Duty (Not Driving)",
          }[drawingState.currentActivityType] || drawingState.currentActivityType
        setNewRemark(`${startTime} - ${endTime}: ${activityLabel} - `)
        setTimeout(() => {
          const input = document.getElementById("remark-input")
          if (input) input.focus()
        }, 100)
      }

      onUpdate?.({ ...log, activities: newActivities, notes, remarks })
    }

    setDrawingState({ ...drawingState, isDrawing: false })
  }

  const handleAddRemark = () => {
    if (newRemark.trim()) {
      const updatedRemarks = [...remarks, newRemark]
      setRemarks(updatedRemarks)
      setNewRemark("")
      onUpdate?.({ ...log, activities, notes, remarks: updatedRemarks })
    }
  }

  const handleRemoveRemark = (index: number) => {
    const updatedRemarks = remarks.filter((_: any, i: number) => i !== index)
    setRemarks(updatedRemarks)
    onUpdate?.({ ...log, activities, notes, remarks: updatedRemarks })
  }

  const stats = calculateDailyStats(activities)
  const hasViolations = stats.violations.length > 0

  return (
    <div
      className="rounded-lg p-6"
      style={{
        backgroundColor: "var(--color-primary)",
        border: hasViolations ? "2px solid var(--color-error)" : "2px solid var(--color-accent)",
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b" style={{ borderColor: "var(--color-accent)" }}>
        <div>
          <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>Date</p>
          <p className="font-bold" style={{ color: "var(--color-accent)" }}>{log.date}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>Day</p>
          <p className="font-bold" style={{ color: "var(--color-accent)" }}>{log.day} of {tripData?.daysNeeded || "?"}</p>
        </div>
        <div className="text-right px-4">
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-xs px-3 py-1 rounded transition-all "
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-neutral-dark)" }}
          >
            {showStats ? "Hide" : "Show"} Stats
          </button>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="mb-6 p-4 rounded" style={{ backgroundColor: "var(--color-neutral-light)" }}>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {["driving", "onDuty", "sleeper", "offDuty"].map((type, i) => (
              <div key={i}>
                <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>{type}</p>
                <p className="font-bold" style={{ color: "var(--color-accent)" }}>{stats[type]}h</p>
              </div>
            ))}
          </div>
          {stats.violations.length > 0 && (
            <div className="p-2 rounded" style={{ backgroundColor: "var(--color-error)", opacity: 0.2 }}>
              <p className="text-xs font-bold" style={{ color: "var(--color-error)" }}>Violations:</p>
              {stats.violations.map((v: string, i: number) => (
                <p key={i} className="text-xs" style={{ color: "var(--color-error)" }}>• {v}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <div className="mb-6">
        <p className="text-sm font-bold mb-3" style={{ color: "var(--color-accent)" }}>
          Hours of Service (Click & drag to draw with 15-min precision)
        </p>
        <div className="overflow-x-auto border rounded-t" style={{ borderColor: "var(--color-accent)" }}>
          <div style={{ width: CANVAS_WIDTH, display: "flex", backgroundColor: "var(--color-neutral-light)" }}>
            {/* Left label space */}
            <div style={{ width: 0 }}></div>

            {/* Timeline hours */}
            <div
              style={{
                position: "relative",
                width: CANVAS_WIDTH,
                height: "28px",
                backgroundColor: "var(--color-neutral-light)",
              }}
            >
              {Array.from({ length: 25 }).map((_, i) => {
                // Label for hour marks (0–24)
                let label = i === 0 ? "0" : i === 12 ? "12" : i < 12 ? i.toString() : (i - 12).toString()

                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${(i / 24) * 100}%`,
                      transform: i === 0 ? "translateX(0)" : "translateX(-50%)",
                      textAlign: "center",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "var(--color-neutral-dark)",
                    }}
                  >
                    {label}
                  </div>
                )
              })}
            </div>

          </div>
        </div>
        <div className="overflow-x-auto border rounded-b" style={{ borderColor: "var(--color-accent)" }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="cursor-crosshair"
            style={{ display: "block", minWidth: "100%" }}
          />
        </div>
      </div>

      <div className="mt-2 text-xs space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["off-duty"] }}></div>
            <span style={{ color: "var(--color-neutral-light)" }}>1: OFF DUTY</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["sleeper"] }}></div>
            <span style={{ color: "var(--color-neutral-light)" }}>2: SLEEPER BERTH</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["driving"] }}></div>
            <span style={{ color: "var(--color-neutral-light)" }}>3: DRIVING</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["on-duty"] }}></div>
            <span style={{ color: "var(--color-neutral-light)" }}>4: ON DUTY (NOT DRIVING)</span>
          </div>
      </div>
      {/* Remarks */}
      <div className="mb-6 mt-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>Remarks</p>
          <p className="text-xs italic" style={{ color: "var(--color-neutral-gray)" }}>
            Drawing auto-generates remarks with time
          </p>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            id="remark-input"
            type="text"
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
            placeholder="Draw or type your remark..."
            className="flex-1 px-3 py-2 rounded text-sm"
            style={{ backgroundColor: "var(--color-neutral-light)", color: "var(--color-neutral-dark)", border: "1px solid var(--color-accent)" }}
          />
          <button
            onClick={handleAddRemark}
            className="px-4 py-2 rounded font-semibold transition-all"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-neutral-dark)" }}
          >
            Add
          </button>
        </div>
        {remarks.length > 0 && (
          <div className="space-y-2">
            {remarks.map((remark: string, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: "var(--color-neutral-light)" }}>
                <span className="text-sm" style={{ color: "var(--color-neutral-dark)" }}>{remark}</span>
                <button
                  onClick={() => handleRemoveRemark(idx)}
                  className="text-xs px-2 py-1 rounded transition-all"
                  style={{ backgroundColor: "var(--color-error)", color: "white" }}
                >
                  <Trash2 className="inline-block w-5 h-5" style={{ color: 'red' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            onUpdate?.({ ...log, activities, notes: e.target.value, remarks })
          }}
          placeholder="Add any additional notes for this day..."
          className="w-full mt-2 p-2 rounded text-sm"
          style={{ backgroundColor: "var(--color-neutral-light)", color: "var(--color-neutral-dark)", border: "1px solid var(--color-accent)" }}
          rows={2}
        />
      </div>
    </div>
  )
}
