import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip, ScrollShadow } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import PromptInput from './prompt-input';
import { useTheme } from '@/hooks/use-theme';

type ChatProps = {
  selectedCarBrand: string;
  userId: string;
};

type ChatMessage = {
  user: boolean;
  message: string;
  imageUrl?: string;
  carDetails?: any;
};

export default function Chat({ selectedCarBrand }: ChatProps) {
  const ideas = [
    {
      title: 'Explore reasonable models',
      description: 'Get insights on the latest and economical models.',
    },
    {
      title: 'Learn about fuel efficiency of Models',
      description: 'Discover how cars rank in fuel efficiency.',
    },
    {
      title: 'Find the best luxury cars',
      description: 'Compare models and their luxury features.',
    },
  ];
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [prompt, setPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const initialMessageAdded = useRef(false);


  const handleAddToCart = (car: any) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const carToAdd = {
      id: car.id,
      title: car.make + ' ' + car.model,
      img: car.imageUrl,
      price: car.price,
      description: car.features || 'No description available',
      trim: car.type || 'N/A',
    };
    cart.push(carToAdd);
    localStorage.setItem('cart', JSON.stringify(cart));
    setChatHistory((prev) => [
      ...prev,
      { user: false, message: `${car.make} ${car.model} has been added to your cart.` },
    ]);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  

const submitQuery = async (query: string) => {
    const userMessage: ChatMessage = { user: true, message: query };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const [openAIResponse, langChainResponse] = await Promise.all([
        axios.post('http://localhost:3000/api/chat-openai', { message: query }),
        axios.post('http://localhost:3000/api/chat-langchain', { message: query })
      ]);

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
          carDetails: {
          id: car.id, // Include the carId here for backend purposes but don't display it
          make: car.make,
          model: car.model,
          type: car.type,
          price: car.price,
          features: car.features,
          imageUrl: car.imageUrl,
        },
        }));

        setChatHistory((prev) => [...prev, ...botMessages]);
      } else {
        setChatHistory(() => [
          { user: false, message: 'No recommendations found. Please try again.' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching data from backend:', error);
      setChatHistory(() => [
        { user: false, message: 'Error fetching response. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const onSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await submitQuery(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmitPrompt(e as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    if (!isUserScrolling && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsUserScrolling(scrollTop + clientHeight < scrollHeight);
      if (scrollTop + clientHeight >= scrollHeight) {
        setIsUserScrolling(false);
      }
    }
  };

  const handleIdeaClick = async (idea: string) => {
    await submitQuery(idea);
  };

  useEffect(() => {
    if (selectedCarBrand && !initialMessageAdded.current) {
      const initialMessage = `Hey, get recommendations on finding your cars!`;
      setChatHistory((prev) => [{ user: false, message: initialMessage }, ...prev]);
      initialMessageAdded.current = true;
    }
  }, [selectedCarBrand]);


  return (
    <div 
      className={`fixed top-16 right-0 flex flex-col gap-4 z-20 justify-between p-5 w-[370px] 
        ${isDark 
          ? 'bg-content1/80 text-content1-foreground' 
          : 'bg-background/80 text-foreground'
        } 
        backdrop-blur-md h-[calc(100vh-4rem)] rounded-lg overflow-hidden
        border-1 ${isDark ? 'border-content2/20' : 'border-default-200/50'}
        transition-colors duration-200`}
    >
      <ScrollShadow hideScrollBar className="flex flex-nowrap gap-2" orientation="horizontal">
        <div className="flex gap-2">
          {ideas.map(({ title, description }, index) => (
            <Button
              key={index}
              className={`flex h-14 flex-col items-start gap-0 
                ${isDark 
                  ? 'hover:bg-content2/50' 
                  : 'hover:bg-default-100'
                }
                transition-colors duration-200`}
              variant="flat"
              onClick={() => handleIdeaClick(description)}
            >
              <p className={isDark ? 'text-content1-foreground' : 'text-foreground'}>{title}</p>
              <p className="text-default-500">{description}</p>
            </Button>
          ))}
        </div>
      </ScrollShadow>

      <div
        ref={chatContainerRef}
        className="flex w-full flex-col gap-2 overflow-y-auto scroll-smooth"
        style={{
          height: '70%',
          overflow: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={handleScroll}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.user ? 'justify-end' : 'justify-start'}`}>
            <div className="w-full flex flex-col items-center gap-2">
              {chat.imageUrl && (
                <div className={`w-full rounded-lg overflow-hidden 
                  ${isDark ? 'border-content2/20' : 'border-default-200/50'} 
                  border-1`}>
                  <img
                    src={chat.imageUrl}
                    alt="Car"
                    className="w-full rounded-lg transition-transform hover:scale-105"
                    style={{ maxWidth: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div
                className={`p-3 mx-3 rounded-lg w-full
                  ${chat.user
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                      ? 'bg-[#E42638] text-white'
                      : 'bg-gray-200 text-black'
                  }
                  transition-colors duration-200`}
                dangerouslySetInnerHTML={{ __html: chat.message }}
              />
              {!chat.user && chat.carDetails && (
                <Button
                  className={`w-full 
                    ${isDark 
                      ? 'bg-gray-600 hover:bg-gray-500 active:bg-gray-400' 
                      : 'bg-gray-300 hover:bg-gray-200 active:bg-gray-100'
                    }
                    text-white transition-colors duration-200`}
                  variant="flat"
                  onClick={() => handleAddToCart(chat.carDetails)}
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`p-2 mx-3 rounded-md 
              ${isDark 
                ? 'bg-content2 text-content2-foreground' 
                : 'bg-default-100 text-default-900'
              }
              transition-colors duration-200`}>
              <span className="animate-pulse">•</span>
              <span className="animate-pulse">•</span>
              <span className="animate-pulse">•</span>
            </div>
          </div>
        )}
      </div>

      <form
        className={`flex w-full flex-col items-start rounded-xl border
          ${isDark 
            ? 'bg-content2/50 hover:bg-content2/70 border-content2/50' 
            : 'bg-default-50/50 hover:bg-default-100/70 border-default-100/50'
          }
          transition-all duration-200`}
        onSubmit={onSubmitPrompt}
      >
        <PromptInput
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
              <Tooltip showArrow content="Send message">
                <Button
                  isIconOnly
                  className={`
                    ${!prompt 
                      ? 'bg-default-300/50 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-500 active:bg-primary-600'
                    }
                    transition-colors duration-200`}
                  isDisabled={!prompt}
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
          placeholder="Type your query here..."
          variant="bordered"
          onValueChange={setPrompt}
          onKeyDown={handleKeyDown}
        />
      </form>
    </div>
  );
}