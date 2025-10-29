import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./ChatComponent.css";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from "../../config";

const socket = io(config.BACKEND_URL);

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUserDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserFirstName(response.data.firstName);
      setUserLastName(response.data.lastName);
      setIsLoggedIn(!!response.data.firstName);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(`${config.BACKEND_URL}/api/message/conversation/${userId}`);
        let sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        if (sortedMessages.length === 0) {
          const welcomeMessage = {
            sender: "admin",
            message: "Welcome to our chat support! How can we assist you today?",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(sortedMessages);
        }
      } catch (error) {
        // Error handling without console.log
      }
    };

    fetchMessages();

    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      socket.emit('joinRoom', userId);

      socket.on("receiveMessage", (messageData) => {
        if (messageData) {
          setMessages(prev => [...prev, messageData]);
          
          if (messageData.sender === 'admin' && !open) {
            setUnreadCount(prev => prev + 1);
            
            toast.info('New message from customer service!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "dark"
            });
          }
        }
      });
    }

    return () => {
      socket.off("receiveMessage");
      socket.emit('leaveRoom');
    };
  }, [open]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(`${config.BACKEND_URL}/api/message/unread-count/${userId}`);
        setUnreadCount(response.data.count);
      } catch (error) {
        // Error handling without console.log
      }
    };

    fetchUnreadCount();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64String = reader.result;
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        try {
          const response = await axios.post(`${config.BACKEND_URL}/api/message/user-message`, {
            userId,
            message: '',
            image: base64String
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.data.success) {
            const savedMessage = response.data.data;
            setMessages(prev => [...prev, savedMessage]);
            socket.emit("sendMessage", savedMessage);
          }
        } catch (error) {
          alert("Failed to send image. Please try again.");
        }
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    if (input.trim()) {
      try {
        const response = await axios.post(`${config.BACKEND_URL}/api/message/user-message`, {
          userId,
          message: input.trim(),
          image: null
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
          const savedMessage = response.data.data;
          setMessages(prev => [...prev, savedMessage]);
          socket.emit("sendMessage", savedMessage);
        }

        setInput("");
      } catch (error) {
        alert("Failed to send message. Please try again.");
      }
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      // Set loading state
      setIsLoading(true);
      
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      
      await axios.delete(`${config.BACKEND_URL}/api/message/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId }
      });

      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      setActiveMenu(null);
      
      toast.success("Message deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to delete message. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  const startEditing = (message) => {
    if (message.sender === "user") {
      setEditingMessageId(message._id);
      setEditText(message.message);
      setActiveMenu(null);
    }
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      
      const response = await axios.put(`${config.BACKEND_URL}/api/message/${editingMessageId}`, {
        message: editText.trim(),
        userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === editingMessageId 
              ? { ...msg, message: editText.trim() } 
              : msg
        ));
        
        setEditingMessageId(null);
        setEditText("");
        
        toast.success("Message updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Failed to update message. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const toggleMenu = (messageId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === messageId ? null : messageId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.message-menu-container')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu]);

  const handleChatOpen = async () => {
    setOpen(!open);
    if (!open) {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        await axios.put(`${config.BACKEND_URL}/api/message/mark-messages-read/${userId}`);
        setUnreadCount(0);
      } catch (error) {
        // Error handling without console.log
      }
    }
  };

  return (
    <div className="chat-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="chat-icon-container">
        <button className="chat-icon" onClick={handleChatOpen}>
          <i className="fas fa-comment-dots"></i>
        </button>
        {unreadCount > 0 && (
          <span className="chat-badge">{unreadCount}</span>
        )}
      </div>

      {open && (
        <div className="chat-popup">
          <div className="chat-header" style={{ display: "flex", alignItems: "center" }}>
            <img src="profile.png" alt="user" style={{ width: "50px", height: "50px", marginLeft: "10px" }} />
            <span style={{ color: "white" }}>XYZ customer service</span>
          </div>

          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "user" ? "user" : "admin"}`}>
                <div className="message-avatar">
                  {msg.sender === "user" ? (
                    <div className="user-avatar">
                      {userFirstName ? userFirstName.charAt(0).toUpperCase() : "U"}
                    </div>
                  ) : (
                    <img 
                      src="profile.png" 
                      alt="Customer Service" 
                      className="admin-avatar"
                    />
                  )}
                </div>
                <div className="message-content-wrapper">
                  <div className="message-content">
                    {editingMessageId === msg._id ? (
                      <div className="edit-message-container">
                        <textarea
                          className="edit-textarea"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Edit your message..."
                        />
                        <div className="edit-buttons">
                          <button className="save-edit-btn" onClick={saveEdit}>
                            Save
                          </button>
                          <button className="cancel-edit-btn" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {msg.message && <span style={{textAlign:"start"}}>{msg.message}</span>}
                        {msg.image && (
                          <div className="image-container">
                            <img 
                              src={msg.image} 
                              alt="Message attachment" 
                              className="chat-image-upload" 
                              style={{ 
                                maxWidth: '200px', 
                                marginTop: msg.message ? '5px' : '0', 
                                background: "white" 
                              }} 
                            />
                            {msg.sender === "user" && (
                              <button 
                                className="delete-image-btn"
                                onClick={() => deleteMessage(msg._id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <span className="spinner" style={{ fontSize: '12px' }}>⏳</span>
                                ) : (
                                  <span>&times;</span>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                        <div className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {msg.sender === "user" && !msg.image && !editingMessageId && (
                    <div className="message-menu-wrapper">
                      <div className="message-menu-container">
                        <button 
                          className="menu-toggle-btn"
                          onClick={(e) => toggleMenu(msg._id, e)}
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        {activeMenu === msg._id && (
                          <div className="message-menu">
                            <button 
                              className="menu-item"
                              onClick={() => startEditing(msg)}
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                              className="menu-item"
                              onClick={() => deleteMessage(msg._id)}
                              disabled={isLoading}
                            >
                              <i className="fas fa-trash"></i> 
                              {isLoading ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filePreview && (
              <div className="message user preview">
                <img 
                  src={filePreview} 
                  alt="Upload preview" 
                  style={{ width: '100%', marginTop: '5px' }} 
                />
              </div>
            )}
          </div>

          <div className="input-container">
            <textarea
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{color:"black"}}
            />
            <label htmlFor="file-upload" className="upload-icon" style={{ cursor: "pointer" }}>
              <img src="upload_image.png" alt="Upload" style={{ width: "24px", height: "24px" }} />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            <button className="send-button" onClick={sendMessage} style={{display:"flex",justifyContent:"center"}}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}