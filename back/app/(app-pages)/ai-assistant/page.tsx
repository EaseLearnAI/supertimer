"use client";

import { useState, useRef, useEffect } from "react";

// Define types for our message content
type TaskCard = {
  type: string;
  title: string;
  time: string;
  location: string;
  priority: "high" | "medium" | "low";
};

type HabitStats = {
  completed: number;
  streak: number;
  improved: boolean;
};

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
  card?: TaskCard;
  cards?: TaskCard[];
  habitStats?: HabitStats;
};

export default function AIAssistantPage() {
  // Sample messages for the chat
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "你好！我是你的AI助手，有什么可以帮助你的吗？", isUser: false, time: "9:30" },
    { id: 2, text: "我想创建一个提醒，明天上午9点提醒我参加会议。", isUser: true, time: "9:31" },
    { id: 3, text: "已为你创建提醒：明天上午9点参加会议。需要我提前多久通知你？", isUser: false, time: "9:31", 
      card: {
        type: "task",
        title: "参加会议",
        time: "明天 上午9:00",
        location: "公司会议室",
        priority: "high"
      }
    },
    { id: 4, text: "提前15分钟通知我就好，谢谢！", isUser: true, time: "9:32" },
    { id: 5, text: "好的，已设置在明天上午8:45提醒你参加会议。还有其他需要我帮忙的吗？", isUser: false, time: "9:32" }
  ]);
  
  // Input and UI state
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Suggested questions
  const suggestions = [
    "帮我安排今天的日程",
    "分析我的习惯完成情况",
    "如何提高工作效率？",
    "推荐一些健康习惯"
  ];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Handle sending a new message
  const handleSend = () => {
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setShowSuggestions(false);
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse: Message;
      
      // Check for specific queries to show cards
      if (newMessage.toLowerCase().includes("日程") || newMessage.toLowerCase().includes("安排")) {
        aiResponse = {
          id: Date.now() + 1,
          text: "我分析了你的日程安排，今天你有以下几个任务需要完成：",
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cards: [
            {
              type: "task",
              title: "团队周会",
              time: "10:00 - 11:30",
              location: "会议室A",
              priority: "high"
            },
            {
              type: "task",
              title: "项目方案审核",
              time: "14:00 - 15:00",
              location: "办公室",
              priority: "medium"
            }
          ]
        };
      } else if (newMessage.toLowerCase().includes("习惯") || newMessage.toLowerCase().includes("锻炼")) {
        aiResponse = {
          id: Date.now() + 1,
          text: "根据你的习惯记录分析，你最近的完成情况如下：",
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          habitStats: {
            completed: 85,
            streak: 12,
            improved: true
          }
        };
      } else {
        aiResponse = {
          id: Date.now() + 1,
          text: "我已经收到你的消息，这是我的回复。如果你有更多问题，随时告诉我！",
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };
  
  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
    setShowSuggestions(false);
  };
  
  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      showToastNotification("语音输入已结束");
      
      // Simulate voice recognition result
      setTimeout(() => {
        setNewMessage("这是通过语音识别的消息");
      }, 1000);
    } else {
      setIsRecording(true);
      showToastNotification("开始语音输入...");
    }
  };
  
  // Show toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // Handle importing a task card
  const handleImportTask = (card: TaskCard) => {
    showToastNotification("任务已导入到日程");
  };
  
  // Handle importing a habit
  const handleImportHabit = (habitStats: HabitStats) => {
    // TODO: Add actual implementation for importing habit
    showToastNotification("习惯已导入到习惯");
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* iOS Header */}
      <div className="h-11 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-b-black/10 px-4">
        <div className="w-8"></div>
        <div className="ios-header-title font-semibold text-base">AI秘书</div>
        <div 
          className="w-8 h-8 flex items-center justify-center text-[#8E8E93]"
          onClick={() => setShowSettingsModal(true)}
        >
          <i className="fas fa-cog"></i>
        </div>
      </div>
      
      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#F2F2F7]"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-container flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {!message.isUser && (
              <div className="avatar w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white mr-2 flex-shrink-0">
                <i className="fas fa-robot text-sm"></i>
              </div>
            )}
            
            <div className="flex flex-col max-w-[80%]">
              <div 
                className={`message p-3 rounded-2xl 
                          ${message.isUser ? 
                            'bg-[#007AFF] text-white rounded-tr-none' : 
                            'bg-white text-[#1C1C1E] rounded-tl-none'} 
                          shadow-sm`}
              >
                {message.text}
                
                {/* Task Card */}
                {message.card && message.card.type === "task" && (
                  <div className="task-card bg-white rounded-xl mt-3 p-3 shadow-sm border border-[#F2F2F7]">
                    <div className="task-header flex items-center mb-2">
                      <div className="task-icon w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#007AFF] mr-2">
                        <i className="fas fa-calendar-alt text-sm"></i>
                      </div>
                      <div className="task-title font-semibold flex-1">{message.card.title}</div>
                      {message.card.priority === "high" && (
                        <div className="priority-tag text-xs py-0.5 px-2 rounded bg-[rgba(255,59,48,0.1)] text-[#FF3B30]">
                          紧急
                        </div>
                      )}
                      {message.card.priority === "medium" && (
                        <div className="priority-tag text-xs py-0.5 px-2 rounded bg-[rgba(255,149,0,0.1)] text-[#FF9500]">
                          中等
                        </div>
                      )}
                    </div>
                    <div className="task-time text-sm text-[#8E8E93]">{message.card.time}</div>
                    {message.card.location && (
                      <div className="task-location text-sm text-[#8E8E93] mt-1 flex items-center">
                        <i className="fas fa-map-marker-alt text-xs mr-1"></i>
                        {message.card.location}
                      </div>
                    )}
                    <button 
                      className="import-button bg-[#007AFF] text-white rounded-lg py-2 text-center text-sm font-medium w-full mt-3"
                      onClick={() => message.card && handleImportTask(message.card)}
                    >
                      导入到日程
                    </button>
                  </div>
                )}
                
                {/* Multiple Task Cards */}
                {message.cards && message.cards.length > 0 && (
                  <div className="task-cards mt-3 space-y-3">
                    {message.cards.map((card, idx) => (
                      <div key={idx} className="task-card bg-white rounded-xl p-3 shadow-sm border border-[#F2F2F7]">
                        <div className="task-header flex items-center mb-2">
                          <div className="task-icon w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#007AFF] mr-2">
                            <i className="fas fa-calendar-alt text-sm"></i>
                          </div>
                          <div className="task-title font-semibold flex-1">{card.title}</div>
                          {card.priority === "high" && (
                            <div className="priority-tag text-xs py-0.5 px-2 rounded bg-[rgba(255,59,48,0.1)] text-[#FF3B30]">
                              紧急
                            </div>
                          )}
                          {card.priority === "medium" && (
                            <div className="priority-tag text-xs py-0.5 px-2 rounded bg-[rgba(255,149,0,0.1)] text-[#FF9500]">
                              中等
                            </div>
                          )}
                        </div>
                        <div className="task-time text-sm text-[#8E8E93]">{card.time}</div>
                        {card.location && (
                          <div className="task-location text-sm text-[#8E8E93] mt-1 flex items-center">
                            <i className="fas fa-map-marker-alt text-xs mr-1"></i>
                            {card.location}
                          </div>
                        )}
                        <button 
                          className="import-button bg-[#007AFF] text-white rounded-lg py-2 text-center text-sm font-medium w-full mt-3"
                          onClick={() => handleImportTask(card)}
                        >
                          导入到日程
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Habit Stats Card */}
                {message.habitStats && (
                  <div className="habit-stats-card bg-white rounded-xl mt-3 p-3 shadow-sm border border-[#F2F2F7]">
                    <div className="stats-header flex items-center mb-3">
                      <div className="stats-icon w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#34C759] mr-2">
                        <i className="fas fa-check-circle text-sm"></i>
                      </div>
                      <div className="stats-title font-semibold">习惯完成情况</div>
                    </div>
                    
                    <div className="stats-row flex items-center justify-between mb-2">
                      <div className="stats-label text-sm text-[#8E8E93]">完成率</div>
                      <div className="stats-value font-medium">
                        {message.habitStats.completed}%
                        {message.habitStats.improved && (
                          <span className="text-[#34C759] ml-1">
                            <i className="fas fa-arrow-up text-xs"></i>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="stats-row flex items-center justify-between">
                      <div className="stats-label text-sm text-[#8E8E93]">当前连续天数</div>
                      <div className="stats-value font-medium">
                        {message.habitStats.streak}天
                      </div>
                    </div>
                    
                    <div className="stats-progress mt-3">
                      <div className="bg-[#F2F2F7] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#34C759] h-full rounded-full" 
                          style={{ width: `${message.habitStats.completed}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="message-time text-xs text-[#8E8E93] mt-1 mx-1">
                {message.time}
              </div>
            </div>
            
            {message.isUser && (
              <div className="avatar w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white ml-2 flex-shrink-0">
                <i className="fas fa-user text-sm"></i>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="message-container flex justify-start mb-4">
            <div className="avatar w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white mr-2 flex-shrink-0">
              <i className="fas fa-robot text-sm"></i>
            </div>
            
            <div className="message max-w-[80%] p-3 px-5 rounded-2xl bg-white text-[#1C1C1E] rounded-tl-none shadow-sm">
              <div className="typing-indicator flex space-x-2">
                <div className="dot w-2 h-2 bg-[#8E8E93] rounded-full animate-bounce"></div>
                <div className="dot w-2 h-2 bg-[#8E8E93] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="dot w-2 h-2 bg-[#8E8E93] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggestions */}
      {showSuggestions && (
        <div className="suggestions px-4 py-2 bg-white border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button 
                key={index} 
                className="suggestion-chip text-sm bg-[#F2F2F7] px-3 py-1.5 rounded-full text-[#1C1C1E] transition-all hover:bg-[#E5E5EA] active:bg-[#D1D1D6]"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="input-area flex items-center p-2 bg-white border-t border-gray-200">
        <div 
          className={`mic-button w-8 h-8 rounded-full ${isRecording ? 'bg-[#FF3B30] animate-pulse' : 'bg-[#007AFF]'} flex items-center justify-center text-white mr-2 flex-shrink-0 cursor-pointer`}
          onClick={toggleRecording}
        >
          <i className="fas fa-microphone text-sm"></i>
        </div>
        
        <div className="flex-1 bg-[#F2F2F7] rounded-full flex items-center px-4 py-2">
          <textarea 
            className="flex-1 bg-transparent outline-none resize-none max-h-24 text-[#1C1C1E] text-base"
            placeholder="发送消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          
          <button 
            className={`send-button ml-2 ${newMessage.trim() ? 'text-[#007AFF]' : 'text-[#8E8E93]'} transition-colors flex-shrink-0`}
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      
      {/* Toast Notification */}
      <div className={`toast fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-full text-sm z-50 flex items-center ${showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
        <i className="fas fa-info-circle mr-2"></i>
        {toastMessage}
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <>
          <div 
            className="overlay fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSettingsModal(false)}
          ></div>
          
          <div className="settings-modal fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] p-5 z-50 transform transition-transform duration-300 max-w-[430px] mx-auto max-h-[90vh] overflow-y-auto">
            <div className="modal-header flex justify-between items-center mb-5">
              <div className="modal-title text-lg font-semibold">设置</div>
              <button 
                className="close-button text-[#8E8E93]"
                onClick={() => setShowSettingsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="settings-section mb-6">
              <div className="settings-section-title text-base font-semibold mb-3">个性化助手</div>
              <div className="settings-description text-sm text-[#8E8E93] mb-4">
                上传录音文件，AI将模仿你的声音进行回复
              </div>
              
              <div className="audio-upload border-2 border-dashed border-[#F2F2F7] rounded-xl p-5 text-center cursor-pointer hover:border-[#007AFF] hover:bg-[rgba(0,122,255,0.05)] transition-all">
                <div className="text-[#007AFF] text-2xl mb-3">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div className="upload-text text-[#8E8E93]">
                  点击上传录音文件或拖拽文件到此处
                </div>
              </div>
            </div>
            
            <div className="settings-section">
              <div className="settings-section-title text-base font-semibold mb-3">高级选项</div>
              <div className="flex items-center justify-between py-3 border-b border-[#F2F2F7]">
                <div className="text-[#1C1C1E]">允许访问日历</div>
                <div className="w-12 h-6 rounded-full bg-[#34C759] relative">
                  <div className="w-5 h-5 rounded-full bg-white absolute right-1 top-0.5 shadow-md"></div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#F2F2F7]">
                <div className="text-[#1C1C1E]">允许访问任务</div>
                <div className="w-12 h-6 rounded-full bg-[#34C759] relative">
                  <div className="w-5 h-5 rounded-full bg-white absolute right-1 top-0.5 shadow-md"></div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="text-[#1C1C1E]">自动语音回复</div>
                <div className="w-12 h-6 rounded-full bg-[#E5E5EA] relative">
                  <div className="w-5 h-5 rounded-full bg-white absolute left-1 top-0.5 shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 