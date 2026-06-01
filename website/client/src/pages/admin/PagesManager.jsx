import { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import CrudTable from '../../components/admin/CrudTable';
import { getPages, updatePage, getSections, createSection, updateSection, deleteSection } from '../../api/endpoints';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

function SectionEditor({ section, onSave, onDelete, onCancel }) {
  const [contentZh, setContentZh] = useState(section.content_zh || '');
  const [contentEn, setContentEn] = useState(section.content_en || '');
  const [activeTab, setActiveTab] = useState('zh');

  const handleSave = () => {
    onSave({ content_zh: contentZh, content_en: contentEn });
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded p-4 mb-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-mono text-xs text-gray-500 mr-2">{section.section_key}</span>
          <span className="text-xs text-gray-400">sort: {section.sort_order}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave}
            className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs rounded">
            Save
          </button>
          <button onClick={onCancel}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs rounded text-gray-600 dark:text-gray-400">
            Cancel
          </button>
          <button onClick={() => { if (confirm('Delete this section?')) onDelete(); }}
            className="px-3 py-1 border border-red-300 text-red-600 text-xs rounded hover:bg-red-50">
            Delete
          </button>
        </div>
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setActiveTab('zh')}
          className={`text-xs px-2 py-1 rounded ${activeTab === 'zh' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
          Chinese
        </button>
        <button onClick={() => setActiveTab('en')}
          className={`text-xs px-2 py-1 rounded ${activeTab === 'en' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
          English
        </button>
      </div>
      <div className={activeTab === 'zh' ? '' : 'hidden'}>
        <ReactQuill theme="snow" value={contentZh} onChange={setContentZh} modules={quillModules}
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white [&_.ql-editor]:min-h-[120px]" />
      </div>
      <div className={activeTab === 'en' ? '' : 'hidden'}>
        <ReactQuill theme="snow" value={contentEn} onChange={setContentEn} modules={quillModules}
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white [&_.ql-editor]:min-h-[120px]" />
      </div>
    </div>
  );
}

function NewSectionForm({ pageId, onCreated, onCancel }) {
  const [key, setKey] = useState('');
  const [sort, setSort] = useState('0');
  const [contentZh, setContentZh] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [tab, setTab] = useState('zh');

  const handleCreate = async () => {
    if (!key.trim()) return;
    await createSection({ page_id: pageId, section_key: key.trim(), sort_order: parseInt(sort) || 0, content_zh: contentZh, content_en: contentEn });
    setKey(''); setSort('0'); setContentZh(''); setContentEn('');
    onCreated();
  };

  return (
    <div className="border border-dashed border-gray-400 dark:border-gray-600 rounded p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">New Section</h3>
      <div className="flex gap-3 mb-3">
        <input placeholder="section_key" value={key} onChange={e => setKey(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
        <input type="number" placeholder="sort" value={sort} onChange={e => setSort(e.target.value)}
          className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setTab('zh')}
          className={`text-xs px-2 py-1 rounded ${tab === 'zh' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700'}`}>ZH</button>
        <button onClick={() => setTab('en')}
          className={`text-xs px-2 py-1 rounded ${tab === 'en' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700'}`}>EN</button>
      </div>
      <div className={tab === 'zh' ? 'mb-3' : 'hidden'}>
        <ReactQuill theme="snow" value={contentZh} onChange={setContentZh} modules={quillModules}
          className="bg-white dark:bg-gray-900 [&_.ql-editor]:min-h-[80px]" />
      </div>
      <div className={tab === 'en' ? 'mb-3' : 'hidden'}>
        <ReactQuill theme="snow" value={contentEn} onChange={setContentEn} modules={quillModules}
          className="bg-white dark:bg-gray-900 [&_.ql-editor]:min-h-[80px]" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleCreate}
          className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs rounded">Add</button>
        <button onClick={onCancel}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs rounded text-gray-600 dark:text-gray-400">Cancel</button>
      </div>
    </div>
  );
}

function PagesManagerContent() {
  const [pages, setPages] = useState([]);
  const [editPage, setEditPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [showNewSection, setShowNewSection] = useState(false);

  const loadPages = () => getPages().then(r => setPages(r.data)).catch(() => {});

  useEffect(() => { loadPages(); }, []);

  const loadSections = useCallback((pageId) => {
    getSections(pageId).then(r => setSections(r.data)).catch(() => {});
  }, []);

  const handleEdit = (page) => {
    setEditPage(page);
    setEditingSectionId(null);
    setShowNewSection(false);
    loadSections(page.id);
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    const { slug, title_zh, title_en, meta_description_zh, meta_description_en } = editPage;
    await updatePage(slug, { title_zh, title_en, meta_description_zh, meta_description_en });
    setEditPage(null);
    loadPages();
  };

  const handleSaveSection = async (sectionId, data) => {
    await updateSection(sectionId, data);
    setEditingSectionId(null);
    loadSections(editPage.id);
  };

  const handleDeleteSection = async (sectionId) => {
    await deleteSection(sectionId);
    loadSections(editPage.id);
  };

  const handleCreateSection = () => {
    setShowNewSection(false);
    loadSections(editPage.id);
  };

  if (editPage) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditPage(null)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit: {editPage.slug}</h1>
        </div>

        {/* Page metadata form */}
        <form onSubmit={handleSavePage} className="space-y-3 max-w-2xl mb-8 border border-gray-300 dark:border-gray-700 rounded p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Page Metadata</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title (Chinese)</label>
            <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={editPage.title_zh} onChange={e => setEditPage({...editPage, title_zh: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title (English)</label>
            <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={editPage.title_en} onChange={e => setEditPage({...editPage, title_en: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Meta Description (Chinese)</label>
            <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={editPage.meta_description_zh || ''} onChange={e => setEditPage({...editPage, meta_description_zh: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Meta Description (English)</label>
            <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={editPage.meta_description_en || ''} onChange={e => setEditPage({...editPage, meta_description_en: e.target.value})} />
          </div>
          <button type="submit" className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm rounded">Save Page Meta</button>
        </form>

        {/* Sections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sections ({sections.length})</h2>
            {!showNewSection && (
              <button onClick={() => setShowNewSection(true)}
                className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs rounded">
                + New Section
              </button>
            )}
          </div>

          {showNewSection && (
            <NewSectionForm pageId={editPage.id} onCreated={handleCreateSection} onCancel={() => setShowNewSection(false)} />
          )}

          {sections.map((section) => (
            editingSectionId === section.id ? (
              <SectionEditor
                key={section.id}
                section={section}
                onSave={(data) => handleSaveSection(section.id, data)}
                onDelete={() => handleDeleteSection(section.id)}
                onCancel={() => setEditingSectionId(null)}
              />
            ) : (
              <div key={section.id}
                onClick={() => setEditingSectionId(section.id)}
                className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-2 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-gray-500">{section.section_key}</span>
                    <span className="text-xs text-gray-400 ml-2">sort: {section.sort_order}</span>
                  </div>
                  <span className="text-xs text-gray-400">Click to edit</span>
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate max-w-lg"
                  dangerouslySetInnerHTML={{ __html: (section.content_zh || '').substring(0, 100) }} />
              </div>
            )
          ))}
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'slug', label: 'Slug', render: r => <span className="font-mono text-xs">{r.slug}</span> },
    { key: 'title_zh', label: 'Title (ZH)' },
    { key: 'title_en', label: 'Title (EN)' },
    { key: 'updated_at', label: 'Updated' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Pages</h1>
      <CrudTable columns={columns} data={pages} onEdit={handleEdit} />
    </div>
  );
}

export default function PagesManager() {
  return <ProtectedRoute><AdminLayout><PagesManagerContent /></AdminLayout></ProtectedRoute>;
}
