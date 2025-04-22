import { useState } from 'react';
import {Heading, Icon} from "@/ui"

export default function ProjectCard({ title, coordinator, category, description, deadline }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isHovered ? 'shadow-xl transform -translate-y-2' : 'shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-xl font-bold text-gray-800 transition-colors duration-300 ${
            isHovered ? 'text-blue-600' : ''
          }`}>{title}</h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
            isHovered ? 'bg-blue-100 text-blue-800' : 'bg-primary text-white'
          }`}>
            {category}
          </span>
        </div>
        
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <Icon id='user' size={16} className="mr-2" />
          <span>{coordinator}</span>
        </div>
        
        <div className={`mt-4 text-gray-700 transition-all duration-300 ${
          isHovered ? 'text-gray-900' : ''
        }`}>
          {description}
        </div>
      </div>
      
      {deadline && (
        <div className={`flex items-center mt-6 pt-4 border-t border-gray-100 text-sm transition-colors duration-300 ${
          isHovered ? 'text-red-600' : 'text-red-500'
        }`}>
          <Icon id='calendar' size={16} className="mr-2" />
          <span><strong>Deadline:</strong> {deadline}</span>
        </div>
      )}
    </div>
  );
}