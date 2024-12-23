import { MessageSquareDot } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquareDot className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Chattu!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting With New People Around!
          Connect with Stangers, Anonymous Chat And Share feelings Build Friendship & Love
        Make Sure Your 18+ , Enjoy a safe and respectful Environment! so Letsss Gooooo!
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
