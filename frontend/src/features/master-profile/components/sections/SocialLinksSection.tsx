import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';

export const SocialLinksSection: React.FC = () => {
  const { register } = useFormContext<MasterProfile>();

  return (
    <section id="socialLinks" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b">Social & Programming Profiles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
          <input 
            {...register('socialLinks.0.linkedin')} 
            type="url"
            placeholder="https://linkedin.com/in/username"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
          <input 
            {...register('socialLinks.0.github')} 
            type="url"
            placeholder="https://github.com/username"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio / Personal Website</label>
          <input 
            {...register('socialLinks.0.portfolio')} 
            type="url"
            placeholder="https://yourwebsite.com"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stack Overflow URL</label>
          <input 
            {...register('socialLinks.0.stackOverflow')} 
            type="url"
            placeholder="https://stackoverflow.com/users/id/name"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">LeetCode URL</label>
          <input 
            {...register('socialLinks.0.leetCode')} 
            type="url"
            placeholder="https://leetcode.com/username"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">HackerRank URL</label>
          <input 
            {...register('socialLinks.0.hackerRank')} 
            type="url"
            placeholder="https://hackerrank.com/username"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
      </div>
    </section>
  );
};
