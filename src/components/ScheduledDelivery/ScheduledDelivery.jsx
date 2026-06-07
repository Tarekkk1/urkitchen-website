import React, { useEffect, useState } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { RiCalendarLine } from "@remixicon/react";
import { get_scheduled_times } from "@/interceptor/routes";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ScheduledDelivery = ({ onScheduleChange }) => {
  const { t } = useTranslation();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    if (slots.length > 0 && !selectedSlot) {
      const first = slots.find((s) => s.isClosed == 0);
      if (first) selectSlot(first);
    }
  }, [slots]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await get_scheduled_times();
      if (!res.error && res.data?.scheduled_times) {
        setSlots(res.data.scheduled_times);
      } else {
        toast.error("Could not load delivery time slots");
      }
    } catch {
      toast.error("Could not load delivery time slots");
    } finally {
      setLoading(false);
    }
  };

  const selectSlot = (slot) => {
    if (slot.isClosed == 1) return;
    setSelectedSlot(slot.uniqueId || `${slot.id}_${slot.date}_${slot.time}`);
    onScheduleChange({
      scheduled_time: `${slot.date} ${slot.time}`,
      scheduled_to_time: slot.timeTo || slot.time,
      is_same_day: 0,
    });
  };

  const groupByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      const key = slot.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(slot);
      return acc;
    }, {});
  };

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const groupedSlots = groupByDate(slots);

  return (
    <Card className="rounded-xl border">
      <CardBody className="space-y-4 p-4">
        <p className="font-semibold text-base flex items-center gap-2">
          <RiCalendarLine size={18} className="text-primary" />
          {t("select_delivery_time") || "Select Delivery Time"}
        </p>

        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner color="primary" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {t("no_scheduled_slots") || "No scheduled slots available"}
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSlots).map(([date, dateSlots]) => (
              <div key={date} className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                  <RiCalendarLine size={14} />
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dateSlots.map((slot) => {
                    const slotId = slot.uniqueId || `${slot.id}_${slot.date}_${slot.time}`;
                    const isClosed = slot.isClosed == 1;
                    const isSelected = selectedSlot === slotId;
                    return (
                      <button
                        key={slotId}
                        onClick={() => selectSlot(slot)}
                        disabled={isClosed}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all
                          ${isClosed ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400" : ""}
                          ${isSelected && !isClosed ? "bg-primary text-white border-primary" : ""}
                          ${!isSelected && !isClosed ? "border-gray-300 hover:border-primary hover:text-primary" : ""}
                        `}
                      >
                        {formatTime(slot.time)}
                        {slot.timeTo ? ` – ${formatTime(slot.timeTo)}` : ""}
                        {isClosed && <span className="ml-1 text-xs">(Closed)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ScheduledDelivery;
