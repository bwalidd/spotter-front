// ELD (Electronic Logging Device) calculations and validations
// Based on FMCSA Hours of Service regulations

export const ACTIVITY_TYPES = {
  OFF_DUTY: "off-duty",
  SLEEPER: "sleeper",
  DRIVING: "driving",
  ON_DUTY: "on-duty",
}

export const ACTIVITY_COLORS = {
  "off-duty": "#64748b",
  sleeper: "#3b82f6",
  driving: "#ff6b35",
  "on-duty": "#f59e0b",
}

// HOS Regulations
export const HOS_RULES = {
  MAX_DRIVING_PER_DAY: 11, // hours
  MAX_DRIVING_PER_WEEK: 60, // hours
  MANDATORY_BREAK: 10, // hours off-duty or sleeper
  MANDATORY_BREAK_AFTER_DRIVING: 8, // hours after 8 hours driving
  MIN_SLEEPER_BREAK: 8, // hours
}

// Calculate available hours for the day
export function calculateAvailableHours(activities, currentCycleUsed, dayIndex) {
  const drivingHours = activities.filter((a) => a === ACTIVITY_TYPES.DRIVING).length
  const availableInCycle = 70 - currentCycleUsed - drivingHours
  return Math.max(0, availableInCycle)
}

// Validate activity sequence
export function validateActivitySequence(activities) {
  const errors = []
  let consecutiveDriving = 0
  let consecutiveOnDuty = 0

  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i]

    if (activity === ACTIVITY_TYPES.DRIVING) {
      consecutiveDriving++
      consecutiveOnDuty = 0

      if (consecutiveDriving > HOS_RULES.MAX_DRIVING_PER_DAY) {
        errors.push(`Hour ${i}: Exceeded max driving hours (${HOS_RULES.MAX_DRIVING_PER_DAY}h)`)
      }

      // Check for mandatory break after 8 hours driving
      if (consecutiveDriving === HOS_RULES.MANDATORY_BREAK_AFTER_DRIVING) {
        let hasBreak = false
        for (let j = i + 1; j < Math.min(i + 3, activities.length); j++) {
          if (activities[j] === ACTIVITY_TYPES.OFF_DUTY || activities[j] === ACTIVITY_TYPES.SLEEPER) {
            hasBreak = true
            break
          }
        }
        if (!hasBreak && i < activities.length - 1) {
          errors.push(`Hour ${i + 1}: Mandatory break required after 8 hours driving`)
        }
      }
    } else if (activity === ACTIVITY_TYPES.OFF_DUTY || activity === ACTIVITY_TYPES.SLEEPER) {
      consecutiveDriving = 0
    }
  }

  return errors
}

// Calculate daily statistics
export function calculateDailyStats(activities) {
  const stats = {
    driving: 0,
    onDuty: 0,
    offDuty: 0,
    sleeper: 0,
    violations: [],
  }

  activities.forEach((activity) => {
    if (activity === ACTIVITY_TYPES.DRIVING) stats.driving++
    else if (activity === ACTIVITY_TYPES.ON_DUTY) stats.onDuty++
    else if (activity === ACTIVITY_TYPES.OFF_DUTY) stats.offDuty++
    else if (activity === ACTIVITY_TYPES.SLEEPER) stats.sleeper++
  })

  stats.violations = validateActivitySequence(activities)
  return stats
}

// Generate default log for a day
export function generateDefaultLog(day, date, estimatedDrivingHours) {
  const activities = Array(24).fill(ACTIVITY_TYPES.OFF_DUTY)

  // Distribute driving hours
  const drivingHoursToAdd = Math.min(estimatedDrivingHours, HOS_RULES.MAX_DRIVING_PER_DAY)
  for (let i = 0; i < drivingHoursToAdd && i < 24; i++) {
    activities[i] = ACTIVITY_TYPES.DRIVING
    //ddd
  }

  // Add sleeper hours
  const sleepStart = Math.min(drivingHoursToAdd + 1, 23)
  for (let i = sleepStart; i < Math.min(sleepStart + 8, 24); i++) {
    activities[i] = ACTIVITY_TYPES.SLEEPER
  }

  return {
    day,
    date,
    activities,
    notes: "",
  }
}

// Calculate total hours used in cycle
export function calculateCycleUsage(logs, initialCycleUsed) {
  let totalDriving = initialCycleUsed
  logs.forEach((log) => {
    const drivingHours = log.activities.filter((a) => a === ACTIVITY_TYPES.DRIVING).length
    totalDriving += drivingHours
  })
  return totalDriving
}
