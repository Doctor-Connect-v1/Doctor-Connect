"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, MessageCircle, User, X } from "lucide-react";

interface Notification {
  id: number;
  type: "appointment" | "message" | "user";
  title: string;
  content: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "appointment",
    title: "Upcoming Appointment",
    content: "Dr. Sarah Johnson, Cardiologist - Tomorrow at 10:00 AM",
  },
  {
    id: 2,
    type: "message",
    title: "New Message",
    content: "Dr. Michael Lee has sent you lab results",
  },
  {
    id: 3,
    type: "user",
    title: "Profile Update",
    content: "Your medical records have been updated",
  },
  {
    id: 4,
    type: "appointment",
    title: "Appointment Reminder",
    content: "Dr. Emily Carter, Neurologist - Thursday at 2:30 PM",
  },
  {
    id: 5,
    type: "message",
    title: "New Message",
    content: "Pharmacy notification: Your prescription is ready",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return (
        <div className="rounded-full bg-blue-100 p-2">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
      );
    case "message":
      return (
        <div className="rounded-full bg-green-100 p-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
        </div>
      );
    case "user":
      return (
        <div className="rounded-full bg-purple-100 p-2">
          <User className="h-5 w-5 text-purple-600" />
        </div>
      );
    default:
      return (
        <div className="rounded-full bg-gray-100 p-2">
          <Bell className="h-5 w-5 text-gray-600" />
        </div>
      );
  }
};

const getNotificationGradient = (type: string) => {
  switch (type) {
    case "appointment":
      return "from-blue-400/20 to-blue-500/20";
    case "message":
      return "from-green-400/20 to-green-500/20";
    case "user":
      return "from-purple-400/20 to-purple-500/20";
    default:
      return "from-gray-400/20 to-gray-500/20";
  }
};

const getNotificationBorder = (type: string) => {
  switch (type) {
    case "appointment":
      return "border-blue-200";
    case "message":
      return "border-green-200";
    case "user":
      return "border-purple-200";
    default:
      return "border-gray-200";
  }
};

const FloatingNotification: React.FC = () => {
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to show random notifications periodically
    const showRandomNotification = () => {
      // Hide current notification if any
      setIsVisible(false);

      // After hiding animation, select a new notification
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * NOTIFICATIONS.length);
        setActiveNotification(NOTIFICATIONS[randomIndex]);

        // Show the new notification
        setIsVisible(true);

        // Hide it after a few seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }, 500); // Wait for hide animation to complete
    };

    // Show first notification after a delay
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    // Set interval to show notifications periodically
    const intervalTimer = setInterval(() => {
      showRandomNotification();
    }, 12000); // Show a new notification every 12 seconds

    // Clean up timers
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed top-24 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && activeNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className={`
              pointer-events-auto max-w-xs rounded-xl
              shadow-lg border backdrop-blur-md
              bg-white/70 p-1
              ${getNotificationBorder(activeNotification.type)}
            `}
          >
            <div
              className={`
              rounded-lg p-3 bg-gradient-to-br 
              ${getNotificationGradient(activeNotification.type)}
            `}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(activeNotification.type)}
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {activeNotification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {activeNotification.content}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="ml-2 flex-shrink-0 bg-white/60 backdrop-blur-sm rounded-full p-1.5 
                           text-gray-400 hover:text-gray-500 
                           focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNotification;
