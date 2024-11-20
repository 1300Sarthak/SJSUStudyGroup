import { Book, Users, Calendar, MessageSquare } from 'lucide-react';

export const geCategories = [
  { id: 'A', name: 'English Language Communication and Critical Thinking', units: 9, color: 'bg-blue-500' },
  { id: 'B', name: 'Scientific Inquiry and Quantitative Reasoning', units: 9, color: 'bg-green-500' },
  { id: 'C', name: 'Arts and Humanities', units: 9, color: 'bg-purple-500' },
  { id: 'D', name: 'Social Sciences', units: 6, color: 'bg-orange-500' },
  { id: 'E', name: 'Human Understanding & Development', units: 3, color: 'bg-red-500' },
  { id: 'F', name: 'Ethnic Studies', units: 3, color: 'bg-yellow-500' },
  { id: 'R', name: 'Earth, Environment, and Sustainability', units: 3, color: 'bg-teal-500' },
  { id: 'S', name: 'Self, Society & Equality in the U.S.', units: 3, color: 'bg-indigo-500' },
  { id: 'V', name: 'Cultures and Global Understanding', units: 3, color: 'bg-pink-500' }
];

export const navigationItems = [
  { id: 'courses', label: 'Courses', icon: Book },
  { id: 'groups', label: 'Study Groups', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];
