import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addAssignment } from '../features/assignments/assignmentsSlice';
import type { Priority } from '../types';

export function AssignmentForm() {
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !title || !dueDate) return alert('Vui lòng nhập đủ thông tin!');

    dispatch(addAssignment({
      subject,
      title,
      dueDate: new Date(dueDate).toISOString(),
      priority,
    }));

    setSubject('');
    setTitle('');
    setDueDate('');
    setPriority('Medium');
  };

  return (
    <form id="assignment-form" onSubmit={handleSubmit} className="assignment-form">
      <div className="form-group">
        <label className="form-label" htmlFor="input-subject">Môn học</label>
        <input
          id="input-subject"
          className="form-input"
          placeholder="Vd: Lập trình Web"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="input-title">Tên bài tập</label>
        <input
          id="input-title"
          className="form-input"
          placeholder="Vd: Bài thực hành 2"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="input-duedate">Ngày hết hạn</label>
        <input
          id="input-duedate"
          type="date"
          className="form-input"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="input-priority">Độ ưu tiên</label>
        <select
          id="input-priority"
          className="form-input"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          <option value="High">🔴 Cao</option>
          <option value="Medium">🟡 Trung bình</option>
          <option value="Low">🟢 Thấp</option>
        </select>
      </div>

      <div className="form-group form-group--submit">
        <button id="btn-add-assignment" type="submit" className="btn btn-primary">
          + Thêm bài tập
        </button>
      </div>
    </form>
  );
}