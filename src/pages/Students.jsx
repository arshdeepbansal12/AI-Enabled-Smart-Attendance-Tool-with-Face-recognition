import React, { useState } from 'react';
import { UserPlus, Upload, Trash2, RefreshCw, Search, ScanFace } from 'lucide-react';
import { classes, studentsByClass } from '../data/mockData';
import { StatusBadge, Avatar, Modal, EmptyState } from '../components/ui/SharedComponents';

export default function Students() {
  const [activeTab, setActiveTab] = useState(classes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const currentStudents = studentsByClass[activeTab] || [];
  
  const filteredStudents = currentStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCount = currentStudents.filter(s => s.enrolledFace).length;
  const notEnrolledCount = currentStudents.length - enrolledCount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Student Management</h1>
          <p className="text-surface-500">Manage enrollments and face registration.</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn btn-outline"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload size={18} />
            Bulk Import CSV
          </button>
          <button className="btn btn-primary">
            <UserPlus size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center justify-between border-l-4 border-l-primary-500">
          <div>
            <p className="text-sm text-surface-500 font-medium">Total Students</p>
            <h3 className="text-2xl font-bold text-surface-900">{currentStudents.length}</h3>
          </div>
        </div>
        <div className="card p-4 flex items-center justify-between border-l-4 border-l-success-500">
          <div>
            <p className="text-sm text-surface-500 font-medium">Enrolled Face</p>
            <h3 className="text-2xl font-bold text-surface-900">{enrolledCount}</h3>
          </div>
        </div>
        <div className="card p-4 flex items-center justify-between border-l-4 border-l-warning-500">
          <div>
            <p className="text-sm text-surface-500 font-medium">Pending Enrollment</p>
            <h3 className="text-2xl font-bold text-surface-900">{notEnrolledCount}</h3>
          </div>
          {notEnrolledCount > 0 && (
            <button className="btn btn-sm btn-outline">Send Reminder</button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="card flex flex-col sm:flex-row justify-between items-center gap-4 p-2 border-b-0 rounded-b-none">
        <div className="flex w-full overflow-x-auto no-scrollbar gap-1">
          {classes.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === c.id 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-surface-600 hover:bg-surface-50'
              }`}
            >
              {c.name} ({c.id})
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs shrink-0 px-2 sm:px-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="input w-full pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Student List */}
      <div className="card overflow-hidden rounded-t-none -mt-6 border-t-0">
        <div className="overflow-x-auto">
          {currentStudents.length === 0 ? (
            <EmptyState 
              icon={UserPlus}
              title="No students found"
              description="There are no students assigned to this class yet."
              actionLabel="Add Student"
              onAction={() => {}}
            />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-surface-500 text-sm border-b border-surface-200">
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Roll No</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Enrollment Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-surface-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.name} src={student.avatarUrl} size="md" />
                          <span className="font-medium text-surface-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-surface-600 font-medium">{student.rollNo}</td>
                      <td className="px-6 py-4 text-surface-500 text-sm">{student.email}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={student.enrolledFace ? 'enrolled' : 'not-enrolled'}>
                          {student.enrolledFace ? 'Enrolled' : 'Pending'}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {student.enrolledFace ? (
                            <button className="btn btn-sm btn-ghost text-surface-600 hover:text-primary-600" title="Re-enroll Face">
                              <RefreshCw size={16} />
                              <span className="hidden xl:inline ml-1">Re-enroll</span>
                            </button>
                          ) : (
                            <button className="btn btn-sm btn-outline text-primary-600 border-primary-200 hover:bg-primary-50" title="Enroll Face">
                              <ScanFace size={16} />
                              <span className="hidden xl:inline ml-1">Enroll Face</span>
                            </button>
                          )}
                          <button className="btn btn-sm btn-ghost text-danger-500 hover:bg-danger-50" title="Remove Student">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-surface-500">
                      No students found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <Modal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)}
        title="Import Students from CSV"
        size="md"
      >
        <div className="p-6 space-y-6">
          <div className="bg-primary-50 text-primary-800 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">CSV Format Requirements:</p>
            <ul className="list-disc pl-5 space-y-1 text-primary-700">
              <li>Must contain columns: <code className="bg-primary-100 px-1 rounded">Name</code>, <code className="bg-primary-100 px-1 rounded">RollNo</code>, <code className="bg-primary-100 px-1 rounded">Email</code></li>
              <li>Maximum 500 students per import</li>
              <li>UTF-8 encoding required</li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-100 text-surface-500 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
              <Upload size={24} />
            </div>
            <h4 className="text-surface-900 font-medium mb-1">Click to upload or drag and drop</h4>
            <p className="text-surface-500 text-sm">CSV files only (max 5MB)</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <button className="btn btn-ghost" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary">
              Import Students
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
