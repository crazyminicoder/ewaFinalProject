import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip, ScrollShadow } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import PromptInput from './prompt-input';

type ChatProps = {
  selectedCarBrand: string;
};

type ChatMessage = {
  user: boolean;
  message: string;
  imageUrl?: string;
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
    }
  ];

  const [prompt, setPrompt] = useState<string>(''); 
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); 
  const chatContainerRef = useRef<HTMLDivElement>(null); 
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false); 
  const initialMessageAdded = useRef(false);

  const submitQuery = async (query: string) => {
    const userMessage: ChatMessage = { user: true, message: query };
    setChatHistory((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/chat', { message: query });

      const botMessage: ChatMessage = { user: false, message: response.data.reply };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
      setChatHistory((prev) => [
        ...prev,
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

  // Function to handle idea click and send it as a query
  const handleIdeaClick = async (idea: string) => {
    await submitQuery(idea);
  };

  // Add the initial message once, to prevent duplicates
  useEffect(() => {
    if (selectedCarBrand && !initialMessageAdded.current) {
      const initialMessage = `Hey, get recommendations on finding your cars!`;
      setChatHistory((prev) => [{ user: false, message: initialMessage }, ...prev]);
      initialMessageAdded.current = true; // Mark that the message has been added
    }
  }, [selectedCarBrand]);

  return (
    <div className="fixed top-16 right-0 flex flex-col gap-4 z-20 justify-between p-5 w-[370px] bg-black bg-opacity-70 backdrop-blur-md h-[calc(100vh-4rem)] rounded-lg overflow-hidden">
      <ScrollShadow hideScrollBar className="flex flex-nowrap gap-2" orientation="horizontal">
        <div className="flex gap-2">
          {ideas.map(({ title, description }, index) => (
            <Button
              key={index}
              className="flex h-14 flex-col items-start gap-0"
              variant="flat"
              onClick={() => handleIdeaClick(description)} // Pass idea description as query
            >
              <p>{title}</p>
              <p className="text-default-500">{description}</p>
            </Button>
          ))}
        </div>
      </ScrollShadow>

      <div
        ref={chatContainerRef}
        className="flex w-full flex-col gap-2 overflow-y-auto"
        style={{ height: '70%' }}
        onScroll={handleScroll}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.user ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 mx-3 rounded-md ${chat.user ? 'bg-[#E42638] text-white' : 'bg-gray-200 text-black'}`}>
              {chat.message}
              {chat.imageUrl && <img src={chat.imageUrl} alt="Car" className="mt-2 rounded" style={{ maxWidth: '100px' }} />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-2 mx-3 rounded-md bg-gray-200 text-black">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse">•</span>
              <span className="animate-pulse">•</span>
            </div>
          </div>
        )}
      </div>

      <form
        className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70"
        onSubmit={onSubmitPrompt}
      >
        <PromptInput
          classNames={{ inputWrapper: '!bg-transparent shadow-none', innerWrapper: 'relative', input: 'pt-1 pl-2 pb-6 !pr-10 text-medium' }}
          endContent={
            <div className="flex items-end gap-2">
              <Tooltip showArrow content="Send message">
                <Button isIconOnly className={!prompt ? 'bg-foreground/50 ' : 'bg-[#F36B6E]'} isDisabled={!prompt} radius="lg" size="sm" variant="solid" type="submit">
                  <Icon className="text-white" icon="solar:arrow-up-linear" width={20} />
                </Button>
              </Tooltip>
            </div>
          }
          minRows={3}
          radius="lg"
          value={prompt}
          placeholder="Type your query here..." 
          variant="flat"
          onValueChange={setPrompt}
          onKeyDown={handleKeyDown}
        />
      </form>
    </div>
  );
}
