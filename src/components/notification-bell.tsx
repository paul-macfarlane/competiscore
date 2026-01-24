"use client";

import {
  getNotificationsAction,
  handleNotificationAction,
} from "@/app/notifications/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LeagueInvitationNotification,
  Notification,
  NotificationAction,
  NotificationType,
} from "@/lib/notifications";
import { ROLE_LABELS } from "@/lib/roles";
import { Bell, Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface NotificationBellProps {
  initialCount?: number;
}

export function NotificationBell({ initialCount = 0 }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [count, setCount] = useState(initialCount);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const result = await getNotificationsAction();
    if (result.data) {
      setNotifications(result.data);
      setCount(result.data.length);
    }
    setIsLoading(false);
  }, []);

  // Fetch notifications only when the popover is opened for the first time or when new notifications might be available.
  useEffect(() => {
    if (!isOpen) return;
    // Use a microtask to avoid cascading renders by ensuring setState happens after the effect completes.
    Promise.resolve().then(fetchNotifications);
    // Alternatively, could use setTimeout(fetchNotifications, 0);
  }, [isOpen, fetchNotifications]);

  const handleAction = async (
    notification: Notification,
    action: NotificationAction,
  ) => {
    const result = await handleNotificationAction(
      notification.type,
      notification.id,
      action,
    );
    if (!result.error) {
      // Remove the notification from the list
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      setCount((prev) => Math.max(0, prev - 1));
    }
    return result;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No notifications
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onAction: (
    notification: Notification,
    action: NotificationAction,
  ) => Promise<{ error?: string }>;
}

function NotificationItem({ notification, onAction }: NotificationItemProps) {
  switch (notification.type) {
    case NotificationType.LEAGUE_INVITATION:
      return (
        <InvitationNotificationItem
          notification={notification}
          onAction={onAction}
        />
      );
    // Future: Add cases for other notification types
    // case NotificationType.CHALLENGE:
    //   return <ChallengeNotificationItem ... />;
    default:
      return null;
  }
}

interface InvitationNotificationItemProps {
  notification: LeagueInvitationNotification;
  onAction: (
    notification: Notification,
    action: NotificationAction,
  ) => Promise<{ error?: string }>;
}

function InvitationNotificationItem({
  notification,
  onAction,
}: InvitationNotificationItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAccept = () => {
    setError(null);
    startTransition(async () => {
      const result = await onAction(notification, NotificationAction.ACCEPT);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/leagues/${notification.data.leagueId}`);
      }
    });
  };

  const handleDecline = () => {
    setError(null);
    startTransition(async () => {
      const result = await onAction(notification, NotificationAction.DECLINE);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="p-3">
      <div className="flex items-start gap-3">
        {notification.data.leagueLogo ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-muted">
            <Image
              src={notification.data.leagueLogo}
              alt={notification.data.leagueName}
              fill
              className="object-cover p-0.5"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
            <span className="text-sm font-bold text-muted-foreground">
              {notification.data.leagueName[0]}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-medium">{notification.data.inviterName}</span>
            {" invited you to join "}
            <span className="font-medium">{notification.data.leagueName}</span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {ROLE_LABELS[notification.data.role]}
            </Badge>
          </div>
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={handleDecline}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <X className="mr-1 h-3 w-3" />
              )}
              Decline
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleAccept}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Check className="mr-1 h-3 w-3" />
              )}
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
