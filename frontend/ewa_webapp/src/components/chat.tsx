import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip, Chip, Input } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import PromptInput from './prompt-input';
import { useTheme } from '@/hooks/use-theme';
import Compressor from 'compressorjs';

type ChatProps = {
  selectedCarBrand: string;
  userId: string;
};

type ChatMessage = {
  user: boolean;
  message: string;
  imageUrl?: string | null;
  carDetails?: any;
  fraudAnalysis?: {
    fraudRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number;
    indicators: string[];
    action: 'DECLINE' | 'ESCALATE' | 'REFUND';
    explanation: string;
    userAdvice: string;
  };
  orderStatus?: {
    orderId: string;
    currentStatus: string;
    estimatedDelivery: string;
    details: string;
  };
  type?: 'car' | 'fraud' | 'status';
};

type OrderVerification = {
  exists: boolean;
  order?: {
    id: string;
    status: string;
    totalPrice: number;
  };
};

export default function Chat({ selectedCarBrand }: ChatProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [prompt, setPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'car' | 'fraud' | 'status'>('car');
  const [orderId, setOrderId] = useState<string>('');
  const [orderVerified, setOrderVerified] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<OrderVerification['order']>();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const initialMessageAdded = useRef(false);

  const placeholderText = mode === 'car'
  ? 'Type your car query here...'
  : mode === 'fraud'
    ? orderVerified 
      ? 'Describe the fraudulent transaction...' 
      : 'Please verify order ID first'
    : 'Enter your order or shipping inquiry...';

  const verifyOrder = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/fraud/verify-order/${id}`);
      const verification: OrderVerification = response.data;
      
      if (verification.exists && verification.order) {
        setOrderVerified(true);
        setCurrentOrder(verification.order);
        setChatHistory(prev => [...prev, {
          user: false,
          message: `Order #${id} verified. Total price: $${verification.order?.totalPrice}. Current status: ${verification.order?.status}. You can now proceed with your fraud report.`,
          type: 'fraud'
        }]);
      } else {
        setChatHistory(prev => [...prev, {
          user: false,
          message: `Order #${id} not found. Please check the order ID and try again.`,
          type: 'fraud'
        }]);
      }
      return verification.exists;
    } catch (error) {
      console.error('Error verifying order:', error);
      setChatHistory(prev => [...prev, {
        user: false,
        message: 'Error verifying order. Please try again.',
        type: 'fraud'
      }]);
      return false;
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const base64String = await fileToBase64(file);
        setSelectedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
        setImageBase64(base64String);
        setMode(mode);
        
        if (!orderVerified) {
          let msg = ''
          if(mode === 'fraud') {
            msg = 'fraud report.'
          } else if(mode === 'status'){
            msg = 'order status.'
          }
          setChatHistory(prev => [...prev, {
            user: false,
            message: `Please provide the order ID to proceed with the` + msg,
            type: mode
          }]);
        }
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
    }
  };

  const handleOrderIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setChatHistory(prev => [...prev, {
        user: true,
        message: `Verifying Order ID: ${orderId}`,
        type: 'fraud'
      }]);
      
      const isValid = await verifyOrder(orderId);
      if (!isValid) {
        setOrderId('');
      }
    }
  };

  const submitFraudReport = async (query: string) => {
    if (!orderVerified || !currentOrder) {
      setChatHistory(prev => [...prev, {
        user: false,
        message: "Please verify an order ID first before submitting a fraud report.",
        type: 'fraud'
      }]);
      return;
    }

    const payload = {
      orderId: currentOrder.id,
      message: query,
      imageData: imageBase64,
      transactionDetails: {
        orderId: currentOrder.id,
        totalPrice: currentOrder.totalPrice,
        status: currentOrder.status
      }
    };

    const userMessage: ChatMessage = {
      user: true,
      message: query,
      imageUrl: imagePreviewUrl,
      type: 'fraud'
    };

    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/fraud/report', payload);
      const { analysis, status } = response.data;

      if (status === 'error' || !analysis) {
        throw new Error(response.data.message || 'Error processing fraud report');
      }
      
      const analysisMessage: ChatMessage = {
        user: false,
        message: `
          <div class="fraud-analysis">
            <h4>Fraud Analysis Result</h4>
            <p><strong>Risk Level:</strong> ${analysis.fraudRisk}</p>
            <p><strong>Confidence:</strong> ${analysis.confidence}%</p>
            <p><strong>Recommended Action:</strong> ${analysis.action}</p>
            <p><strong>Explanation:</strong> ${analysis.explanation}</p>
           `,
        fraudAnalysis: analysis,
        type: 'fraud'
      };

      setChatHistory(prev => [...prev, analysisMessage]);
    } catch (error: unknown) {
      console.error('Error submitting fraud report:', error);
      
      // Type guard for axios error
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : 'An unknown error occurred';

      setChatHistory(prev => [...prev, {
        user: false,
        message: `Error processing fraud report: ${errorMessage}`,
        type: 'fraud'
      }]);
    } finally {
      setLoading(false);
      setImageBase64(null);
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        success: (compressedResult) => resolve(compressedResult as File),
        error: (error) => reject(error),
      });
    });
  };

  const processOpenAIResponse = (data: any) => {
    if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
      const content = data.choices[0].message.content;
      console.log("API content =", content);
  
      // Normalize the content to handle case sensitivity and extra spaces
      if (content.includes('Repair Needed')) {
        return {
          decision: 'Repair Needed',
          explanation: 'The damage is minor, such as scratches or dents, which can be resolved through repair.'
        };
      } else if (content.includes('Replace Needed')) {
        return {
          decision: 'Replace Needed',
          explanation: 'The damage is significant, such as broken parts or severe structural issues, requiring a replacement.'
        };
      } else if (content.includes('Human Agent')) {
        return {
          decision: 'Escalate to Human Agent',
          explanation: 'The damage assessment is unclear or requires further investigation by a human agent.'
        };
      }
    }
    
    return {
      decision: 'Unknown status',
      explanation: 'The analysis could not determine a clear decision based on the provided data.'
    };
  };
  

  const submitOrderStatusQuery = async (query: string) => {
    console.log("submit order status")
    
    if (!orderVerified || !currentOrder) {
      setChatHistory(prev => [...prev, {
        user: false,
        message: "Please verify an order ID first before submitting a defect report.",
        type: 'status'
      }]);
      return;
    }

    const payload = {
      orderId: currentOrder.id,
      message: query,
      imageData: selectedImage,
      transactionDetails: {
        orderId: currentOrder.id,
        totalPrice: currentOrder.totalPrice,
        status: currentOrder.status
      }
    };

    const userMessage: ChatMessage = {
      user: true,
      message: query,
      imageUrl: imagePreviewUrl,
      type: 'status'
    };

    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
  
    try {

      if (selectedImage) {
        try {
          const compressedImage = await compressImage(selectedImage);
          const reader = new FileReader();
      
          const imageFormat = "jpeg";
          const imageFile = {
            mimetype: imageFormat === "jpeg" ? "image/jpeg" : "image/png",
          };
      
          reader.onloadend = async () => {
            const base64Image = reader.result as string;
      
            if (base64Image) {
              const base64Data = base64Image.split(",")[1];
      
              const optimizedContent = [
                {
                  type: "text",
                  text:`Classify this car image as "Repair Needed", "Replace Needed", or "Escalate to Human Agent".

                  Analyze the car image and determine if it requires:

                  Repair Needed,
                  Replace Needed, or
                  Escalate to Human Agent.

                  Criteria:

                  If the damage is minor (e.g., scratches, dents), classify it as Repair Needed.
                  If the damage is significant (e.g., broken parts, severe structural damage), classify it as Replace Needed.
                  If the damage assessment is unclear or requires further investigation, escalate it to a human agent.
                  Do not include "Repair Needed" or "Replace Needed" if it is an escalate.

                  Please analyze the image data provided below and apply these criteria for accurate classification.
                  Ensure the response explicitly uses the classification terms: "Repair Needed", "Replace Needed", or "Escalate to Human Agent".`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${imageFile.mimetype};base64,${base64Data}`,
                  },
                },
              ];

              const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
              try {
                // Send the image and request to OpenAI's GPT model
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    model: "gpt-4o-2024-08-06",
                    messages: [
                      {
                        role: "user",
                        content: optimizedContent,
                      },
                    ],
                  }),
                });
      
                if (!response.ok) {
                  const errorData = await response.json();
                  console.error("OpenAI API error:", errorData);
                  throw new Error(`OpenAI API error: ${errorData.error.message}`);
                }
      
                const openAIResponse = await response.json();
                const { decision, explanation } = processOpenAIResponse(openAIResponse);

                const formData = {
                  status: decision,
                  orderId: orderId
                };

                console.log("formData", formData);
                const response1 = await axios.post('http://localhost:3000/api/order/status', formData);

                console.log("resposne1.data = ",response1.data)

                const { status, orderDetails  } = response1.data;

      if (status === 'error' || !orderDetails) {
        throw new Error(response1.data.message || 'Error processing fraud report');
      }
      
      const analysisMessage: ChatMessage = {
        user: false,
        message: `
          <div class="order-status-analysis">
            <h4>Order Status Analysis Result</h4>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
            <p><strong>Status:</strong> ${orderDetails.status}</p>
            <p><strong>Recommended Action:</strong> ${decision}</p>
            <p><strong>Explanation:</strong> ${explanation}</p>
        </div>
           `,
        type: 'status'
      };

      setChatHistory(prev => [...prev, analysisMessage]);
              } catch (error) {
                console.error("Error communicating with OpenAI API:", error);
              }
            }
          };
      
          reader.readAsDataURL(compressedImage);
        } catch (error) {
          console.error("Error processing the image:", error);
        }
      }
    } catch (error) {
      console.error('Error checking order status:', error);
      setChatHistory((prev) => [...prev, {
        user: false,
        message: 'Error retrieving order status. Please try again.',
        type: 'status'
      }]);
    } finally {
      setLoading(false);
      setImageBase64(null);
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };
  

  const submitCarQuery = async (query: string) => {
    const userMessage: ChatMessage = { user: true, message: query, type: 'car' };
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const openAIResponse = await axios.post('http://localhost:3000/api/chat-openai', { message: query });

      if (Array.isArray(openAIResponse.data.reply)) {
        const botMessages = openAIResponse.data.reply.map((car: any) => ({
          user: false,
          message: `
            <strong>${car.make} ${car.model}</strong><br/>
            <strong>Type:</strong> ${car.type}<br/>
            <strong>Price:</strong> $${car.price}<br/>
            <strong>Features:</strong> ${car.features}
          `,
          imageUrl: car.imageUrl,
          carDetails: car,
          type: 'car'
        }));

        setChatHistory(prev => [...prev, ...botMessages]);
      }
    } catch (error) {
      console.error('Error fetching car recommendations:', error);
      setChatHistory(prev => [...prev, {
        user: false,
        message: 'Error fetching recommendations. Please try again.',
        type: 'car'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      if (mode === 'fraud') {
        await submitFraudReport(prompt);
      }else if(mode === 'status'){
        await submitOrderStatusQuery(prompt);
      } else {
        await submitCarQuery(prompt);
      }
      setPrompt('');
    }
  };

  useEffect(() => {
    if (!isUserScrolling && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (selectedCarBrand && !initialMessageAdded.current) {
      const initialMessage = `Hey, I can help you with car recommendations and fraud reporting. What would you like to do?`;
      setChatHistory([{ user: false, message: initialMessage, type: 'car' }]);
      initialMessageAdded.current = true;
    }
  }, [selectedCarBrand]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsUserScrolling(scrollTop + clientHeight < scrollHeight);
      if (scrollTop + clientHeight >= scrollHeight) {
        setIsUserScrolling(false);
      }
    }
  };

  return (
    <div className={`fixed top-16 right-0 flex flex-col gap-4 z-20 justify-between p-5 w-[370px] 
      ${isDark ? 'bg-content1/80 text-content1-foreground' : 'bg-background/80 text-foreground'}
      backdrop-blur-md h-[calc(100vh-4rem)] rounded-lg
      border-1 ${isDark ? 'border-content2/20' : 'border-default-200/50'}
      transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            color={mode === 'car' ? 'primary' : 'default'}
            variant={mode === 'car' ? 'solid' : 'flat'}
            onClick={() => setMode('car')}
          >
            Car Search
          </Button>
          <Button
            size="sm"
            color={mode === 'fraud' ? 'primary' : 'default'}
            variant={mode === 'fraud' ? 'solid' : 'flat'}
            onClick={() => {
              setMode('fraud');
              if (!orderVerified) {
                setChatHistory(prev => [...prev, {
                  user: false,
                  message: "Please provide the order ID to proceed with fraud reporting.",
                  type: 'fraud'
                }]);
              }
            }}
          >
            Fraud Report
          </Button>
          <Button
            size="sm"
            color={mode === 'status' ? 'primary' : 'default'}
            variant={mode === 'status' ? 'solid' : 'flat'}
            onClick={() => setMode('status')}
          >
            Order/Shipping Status
          </Button>
        </div>
      </div>

      {(mode === 'fraud' || mode === 'status') && !orderVerified && (
        <form onSubmit={handleOrderIdSubmit} className="flex gap-2 mb-4">
          <Input
            size="sm"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1"
          />
          <Button
            size="sm"
            color="primary"
            type="submit"
            isDisabled={!orderId.trim()}
          >
            Verify
          </Button>
        </form>
      )}

      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col gap-2 overflow-y-auto scroll-smooth pr-2"
        onScroll={handleScroll}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.user ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex flex-col items-${chat.user ? 'end' : 'start'} gap-2`}>
              {chat.imageUrl && (
                <div className={`w-full max-w-[300px] rounded-lg overflow-hidden 
                  ${isDark ? 'border-content2/20' : 'border-default-200/50'} border-1`}>
                  <img
                    src={chat.imageUrl}
                    alt={chat.type === 'car' ? "Car" : "Receipt"}
                    className="w-full rounded-lg transition-transform hover:scale-105"
                    style={{ maxWidth: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div
                className={`p-3 rounded-lg break-words
                  ${chat.user
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                      ? 'bg-red-500'
                      : 'bg-default-100 text-default-900'
                  }
                  ${chat.fraudAnalysis ? 'fraud-analysis' : ''}
                  transition-colors duration-200`}
                dangerouslySetInnerHTML={{ __html: chat.message }}
              />
              {!chat.user && chat.fraudAnalysis && (
                <Chip
                  color={
                    chat.fraudAnalysis.action === 'REFUND' ? 'success' :
                    chat.fraudAnalysis.action === 'DECLINE' ? 'danger' : 'warning'
                  }
                  className="ml-2"
                >
                  {chat.fraudAnalysis.action}
                </Chip>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`p-2 rounded-md 
              ${isDark ? 'bg-content2 text-content2-foreground' : 'bg-default-100 text-default-900'}
              transition-colors duration-200`}>
              <span className="animate-pulse">•</span>
              <span className="animate-pulse">•</span>
              <span className="animate-pulse">•</span>
            </div>
          </div>
        )}
      </div>

      <form
        className={`flex w-full flex-col items-start rounded-xl border mt-4
          ${isDark 
            ? 'bg-content2/50 hover:bg-content2/70 border-content2/50' 
            : 'bg-default-50/50 hover:bg-default-100/70 border-default-100/50'
          }
          transition-all duration-200`}
        onSubmit={onSubmitPrompt}
      >
        {selectedImage && (
          <div className="px-3 pt-2 flex items-center gap-2">
            <Icon icon="solar:gallery-linear" className="text-primary" />
            <span className="text-sm text-default-600">{selectedImage.name}</span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="ml-auto"
              onClick={() => {
                setSelectedImage(null);
                setImageBase64(null);
                setImagePreviewUrl(null);
              }}
            >
              <Icon icon="solar:close-circle-linear" className="text-default-500" />
            </Button>
          </div>
        )}
        <PromptInput
          isDisabled={mode === 'fraud' && !orderVerified}
          classNames={{
            inputWrapper: '!bg-transparent shadow-none',
            innerWrapper: 'relative',
            input: `pt-1 pl-2 pb-6 !pr-10 text-medium 
              ${isDark 
                ? 'text-content1-foreground placeholder:text-content1-foreground/50' 
                : 'text-foreground placeholder:text-foreground/50'
              }`,
          }}
          endContent={
            <div className="flex items-end gap-2 pb-2 pr-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
                disabled={mode === 'fraud' && !orderVerified}
              />
              <Tooltip showArrow content="Attach image">
                <Button
                  isIconOnly
                  className={`bg-default-300 hover:bg-default-400`}
                  radius="lg"
                  size="sm"
                  variant="flat"
                  onClick={() => fileInputRef.current?.click()}
                  isDisabled={mode === 'fraud' && !orderVerified}
                >
                  <Icon
                    className="text-default-500"
                    icon="solar:gallery-add-linear"
                    width={20}
                  />
                </Button>
              </Tooltip>
              <Tooltip showArrow content="Send message">
                <Button
                  isIconOnly
                  className={`
                    ${!prompt 
                      ? 'bg-default-300/50 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-500 active:bg-primary-600'
                    }
                    transition-colors duration-200`}
                  isDisabled={!prompt || (mode === 'fraud' && !orderVerified)}
                  radius="lg"
                  size="sm"
                  variant="solid"
                  type="submit"
                >
                  <Icon 
                    className={`${!prompt ? 'text-default-500' : 'text-white'}`} 
                    icon="solar:arrow-up-linear" 
                    width={20} 
                  />
                </Button>
              </Tooltip>
            </div>
          }
          minRows={3}
          radius="lg"
          value={prompt}
          placeholder={placeholderText}
          variant="bordered"
          onValueChange={setPrompt}
        />
      </form>
    </div>
  );
}
