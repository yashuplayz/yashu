import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageSquareDot, Bell } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, messages, subscribeToMessages, unsubscribeFromMessages, isUsersLoading, getUnreadMessages } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    getUsers();
    subscribeToMessages();
    fetchUnreadMessages(); // Fetch unread messages from the backend

    return () => unsubscribeFromMessages();
  }, [getUsers, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.senderId !== authUser._id) {
        setUnreadMessages((prev) => ({
          ...prev,
          [latestMessage.senderId]: true,
        }));
      }
    }
  }, [messages, authUser._id]);

  useEffect(() => {
    // Reset unread message notifications for the selected user
    if (selectedUser && unreadMessages[selectedUser._id]) {
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedUser._id]: false,
      }));
    }
  }, [selectedUser]);

  const fetchUnreadMessages = async () => {
    const unreadMessages = await getUnreadMessages();
    setUnreadMessages(unreadMessages);
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Find People</span>
          {Object.values(unreadMessages).some((isUnread) => isUnread) && (
            <Bell className="size-6 text-green-500" />
          )}
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show Online People</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setUnreadMessages((prev) => ({
                ...prev,
                [user._id]: false,
              }));
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
              {unreadMessages[user._id] && (
                <MessageSquareDot className="absolute top-0 right-0 w-4 h-4 text-green-900" />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
