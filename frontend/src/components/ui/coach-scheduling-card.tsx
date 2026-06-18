"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  dayNumber: number;
  slots: TimeSlot[];
  hasAvailability: boolean;
}

interface Coach {
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

interface CoachSchedulingProps {
  coach?: Coach;
  locations?: string[];
  weekSchedule?: DaySchedule[];
  onLocationChange?: (location: string) => void;
  onTimeSlotSelect?: (day: string, time: string) => void;
  onWeekChange?: (direction: "prev" | "next") => void;
  enableAnimations?: boolean;
  className?: string;
}

const defaultCoach: Coach = {
  name: process.env.NEXT_PUBLIC_CONSULTANT_NAME || "Automation Consultant",
  title: "Automation Consultant",
  location: "Remote (Zoom / Google Meet)",
  rating: 4.9,
  reviewCount: 50,
  imageUrl: "/avatars/avatar-boy.png",
};

const defaultLocations = [
  "Remote (Zoom)",
  "Remote (Google Meet)",
  "Remote (Microsoft Teams)",
];

function generateWeekSchedule(): DaySchedule[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  ];

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isPast = d < new Date(new Date().setHours(0, 0, 0, 0));
    const dateStr = `${shortMonths[d.getMonth()]} ${d.getDate()}`;

    return {
      date: dateStr,
      dayName: dayNames[i],
      dayNumber: d.getDate(),
      hasAvailability: !isPast,
      slots: isPast
        ? []
        : slots.map((time, si) => ({ time, available: si !== 5 })),
    };
  });
}

const defaultWeekSchedule = generateWeekSchedule();

export function CoachSchedulingCard({
  coach = defaultCoach,
  locations = defaultLocations,
  weekSchedule = defaultWeekSchedule,
  onLocationChange,
  onTimeSlotSelect,
  onWeekChange,
  enableAnimations = true,
  className,
}: CoachSchedulingProps) {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [showConfirmationView, setShowConfirmationView] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    day: string;
    time: string;
    dayName: string;
  } | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [currentWeek, setCurrentWeek] = useState(weekSchedule);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekRange =
    currentWeek.length > 0
      ? `${currentWeek[0].date} – ${currentWeek[currentWeek.length - 1].date}`
      : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLocationDropdownOpen(false);
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
    onLocationChange?.(location);
  };

  const handleTimeSlotClick = (day: string, time: string) => {
    const dayInfo = currentWeek.find((d) => d.date === day);
    setSelectedTimeSlot({ day, time, dayName: dayInfo?.dayName || day });
    setShowConfirmationView(true);
    onTimeSlotSelect?.(day, time);
  };

  const handleBackToMain = () => {
    setShowConfirmationView(false);
    setSelectedTimeSlot(null);
  };

  const handleConfirmBooking = () => {
    setShowConfirmationView(false);
    setSelectedTimeSlot(null);
  };

  const handleWeekNavigation = (direction: "prev" | "next") => {
    const newOffset = direction === "next" ? weekOffset + 1 : weekOffset - 1;
    if (direction === "prev" && newOffset < 0) return;
    setWeekOffset(newOffset);

    const base = new Date();
    const dayOfWeek = base.getDay();
    const monday = new Date(base);
    monday.setDate(base.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + newOffset * 7);

    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const slots = [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
      "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    ];

    const newWeek = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isPast = d < new Date(new Date().setHours(0, 0, 0, 0));
      return {
        date: `${shortMonths[d.getMonth()]} ${d.getDate()}`,
        dayName: dayNames[i],
        dayNumber: d.getDate(),
        hasAvailability: !isPast,
        slots: isPast ? [] : slots.map((time, si) => ({ time, available: si !== 5 })),
      };
    });

    setCurrentWeek(newWeek);
    onWeekChange?.(direction);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.6 },
    },
  };

  const timeSlotVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={shouldAnimate ? containerVariants : {}}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      className={cn(
        "bg-[rgba(255,255,255,0.03)] rounded-2xl border border-white/[0.08] shadow-[4px_4px_12px_rgba(0,0,0,0.5)] overflow-hidden max-w-2xl relative",
        className
      )}
    >
      <div className="relative h-auto">
        {/* Main Content */}
        <motion.div
          initial={false}
          animate={{
            y: showConfirmationView ? "-20px" : "0px",
            opacity: showConfirmationView ? 0.3 : 1,
            scale: showConfirmationView ? 0.97 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          className="w-full"
        >
          {/* Coach Profile */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <motion.div
                whileHover={shouldAnimate ? { scale: 1.05 } : {}}
                className="flex-shrink-0"
              >
                <img
                  src={coach.imageUrl}
                  alt={coach.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/10"
                />
              </motion.div>

              <div className="flex-1 min-w-0 space-y-2">
                <h2 className="text-lg font-heading font-bold text-white">{coach.name}</h2>
                <div className="flex items-center gap-2 text-sm text-[#A1A1AA] font-body flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                    <span className="font-medium text-white">{coach.rating}</span>
                    <span className="text-[#71717A]">({coach.reviewCount} reviews)</span>
                  </div>
                  <span className="text-white/20">•</span>
                  <span>{coach.title}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-[#71717A] uppercase tracking-wider mb-1 font-body">Free</p>
                <p className="text-2xl font-heading font-black text-[#10B981]">$0</p>
                <p className="text-[10px] text-[#71717A] font-body">60 min audit</p>
              </div>
            </div>
          </motion.div>

          {/* Location Selector */}
          <motion.div
            variants={shouldAnimate ? itemVariants : {}}
            className="px-6 pb-4 relative z-50"
            style={{ overflow: "visible" }}
          >
            <label className="block text-xs font-subheading font-semibold text-[#71717A] uppercase tracking-wider mb-2">
              Meeting format
            </label>
            <div className="relative z-50" ref={dropdownRef}>
              <motion.button
                whileHover={shouldAnimate ? { scale: 1.01 } : {}}
                whileTap={shouldAnimate ? { scale: 0.99 } : {}}
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                aria-expanded={isLocationDropdownOpen}
                aria-haspopup="listbox"
                className="w-full flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-colors text-white font-body text-sm"
              >
                <span>{selectedLocation}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-[#71717A] transition-transform",
                    isLocationDropdownOpen && "rotate-180"
                  )}
                />
              </motion.button>

              <AnimatePresence>
                {isLocationDropdownOpen && (
                  <motion.div
                    initial={shouldAnimate ? { opacity: 0, y: -8, scale: 0.97 } : {}}
                    animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
                    exit={shouldAnimate ? { opacity: 0, y: -8, scale: 0.97 } : {}}
                    transition={shouldAnimate ? { type: "spring", stiffness: 400, damping: 25 } : {}}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#111119] border border-white/[0.08] rounded-xl shadow-2xl z-[9999] overflow-hidden"
                    role="listbox"
                  >
                    {locations.map((location, index) => (
                      <motion.button
                        key={location}
                        initial={shouldAnimate ? { opacity: 0, x: -8 } : {}}
                        animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                        transition={shouldAnimate ? { delay: index * 0.05 } : {}}
                        onClick={() => handleLocationChange(location)}
                        role="option"
                        aria-selected={location === selectedLocation}
                        className="w-full text-left p-3 hover:bg-white/[0.05] transition-colors text-white font-body text-sm"
                      >
                        {location}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Separator */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="mx-6 border-t border-white/[0.06]" />

          {/* Week Navigation */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={shouldAnimate ? { scale: 1.05 } : {}}
                whileTap={shouldAnimate ? { scale: 0.95 } : {}}
                onClick={() => handleWeekNavigation("prev")}
                disabled={weekOffset <= 0}
                aria-label="Previous week"
                className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 text-[#A1A1AA]" />
              </motion.button>

              <h3 className="font-subheading font-semibold text-white text-sm">{weekRange}</h3>

              <motion.button
                whileHover={shouldAnimate ? { scale: 1.05 } : {}}
                whileTap={shouldAnimate ? { scale: 0.95 } : {}}
                onClick={() => handleWeekNavigation("next")}
                aria-label="Next week"
                className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#A1A1AA]" />
              </motion.button>
            </div>
          </motion.div>

          {/* Daily Schedule */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="px-6 pb-6 space-y-4">
            {currentWeek.map((day) => (
              <motion.div key={day.date} variants={shouldAnimate ? itemVariants : {}} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-subheading font-semibold text-white text-sm">
                    {day.dayName}, {day.date}
                  </h4>
                  {!day.hasAvailability && (
                    <span className="text-xs text-[#71717A] font-body">No availability</span>
                  )}
                </div>

                {day.hasAvailability && (
                  <motion.div
                    variants={shouldAnimate ? containerVariants : {}}
                    className="flex flex-wrap gap-2"
                  >
                    {day.slots.map((slot) => (
                      <motion.button
                        key={`${day.date}-${slot.time}`}
                        variants={shouldAnimate ? timeSlotVariants : {}}
                        whileHover={shouldAnimate && slot.available ? { scale: 1.05, y: -1 } : {}}
                        whileTap={shouldAnimate && slot.available ? { scale: 0.98 } : {}}
                        onClick={() => slot.available && handleTimeSlotClick(day.date, slot.time)}
                        disabled={!slot.available}
                        className={cn(
                          "px-3 py-1.5 text-xs font-body rounded-lg border transition-all",
                          slot.available
                            ? "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.07] text-white cursor-pointer"
                            : "bg-white/[0.01] border-white/[0.04] text-[#3A3A42] cursor-not-allowed line-through"
                        )}
                      >
                        {slot.time}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Actions */}
          <motion.div
            variants={shouldAnimate ? itemVariants : {}}
            className="border-t border-white/[0.06] p-6"
          >
            <div className="flex gap-3">
              <motion.button
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                className="flex-1 bg-white/[0.05] text-[#A1A1AA] py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors font-body text-sm border border-white/[0.06]"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white py-2.5 rounded-xl font-heading font-semibold text-sm hover:shadow-[0_4px_20px_rgba(255,107,0,0.4)] transition-all"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Confirmation View */}
        <motion.div
          initial={false}
          animate={{
            y: showConfirmationView ? "0%" : "100%",
            opacity: showConfirmationView ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          className="absolute top-0 left-0 w-full h-full bg-[#0D0D14]"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToMain}
                className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-body">Back</span>
              </motion.button>
              <h3 className="text-base font-heading font-bold text-white">Confirm Booking</h3>
              <div />
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <img
                src={coach.imageUrl}
                alt={coach.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div>
                <h4 className="font-heading font-semibold text-white">{coach.name}</h4>
                <p className="text-sm font-body text-[#71717A]">{coach.title}</p>
              </div>
            </div>

            {selectedTimeSlot && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-xs font-subheading text-[#71717A] uppercase tracking-wider mb-3">
                    Your Selected Slot
                  </p>
                  <div className="bg-[rgba(255,107,0,0.08)] border border-[rgba(255,107,0,0.2)] rounded-xl p-4">
                    <p className="text-base font-heading font-semibold text-white">
                      {selectedTimeSlot.dayName}, {selectedTimeSlot.day}
                    </p>
                    <p className="text-2xl font-heading font-black text-[#FF6B00]">
                      {selectedTimeSlot.time}
                    </p>
                    <p className="text-xs font-body text-[#71717A] mt-1">India Standard Time (IST)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                    <span className="text-sm font-body text-[#A1A1AA]">Format:</span>
                    <span className="text-sm font-body text-white">{selectedLocation}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                    <span className="text-sm font-body text-[#A1A1AA]">Duration:</span>
                    <span className="text-sm font-body text-white">60 minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-body text-[#A1A1AA]">Price:</span>
                    <span className="text-sm font-body text-[#10B981] font-semibold">Free</span>
                  </div>
                </div>
              </div>
            )}

            <motion.button
              whileHover={shouldAnimate ? { scale: 1.02, y: -1 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={handleConfirmBooking}
              className="w-full relative overflow-hidden py-3 rounded-xl font-heading font-bold text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] hover:shadow-[0_6px_30px_rgba(255,107,0,0.5)] transition-all group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                CONFIRM BOOKING
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
