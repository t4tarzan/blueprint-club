import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface WhiteboardProps {
  content: string;
  isLoading?: boolean;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({ content, isLoading }) => {
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header - Fixed */}
      <div className="p-4 border-b border-gray-200 flex-none">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </motion.div>
          ) : content ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="prose prose-sm md:prose-base lg:prose-lg max-w-none"
            >
              <ReactMarkdown>{content}</ReactMarkdown>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-gray-500"
            >
              Select a tutor and ask a question...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
