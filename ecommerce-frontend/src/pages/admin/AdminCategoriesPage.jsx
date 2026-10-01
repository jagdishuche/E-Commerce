import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Pencil, Trash2 } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await categoryApi.updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
        });
        if (res.success) {
          addToast('Category updated successfully', 'success');
          fetchCategories();
        }
      } else {
        const res = await categoryApi.createCategory({
          name: name.trim(),
          description: description.trim(),
        });
        if (res.success) {
          addToast('Category created successfully', 'success');
          fetchCategories();
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryApi.deleteCategory(id);
      addToast('Category deleted successfully', 'info');
      setCategories(categories.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      addToast(err.message || 'Cannot delete category with active products', 'error');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Organize your store catalog into departmental classifications</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Category Name</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Product Count</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900 text-sm">{cat.name}</td>
                <td className="py-4 px-6 text-slate-500 max-w-md truncate">{cat.description}</td>
                <td className="py-4 px-6">
                  <span className="bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200">
                    {cat.productCount || 0} items
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Photography Gear"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short description of products in this category..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Category"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete this category? Make sure no products are assigned to it first.
          </p>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirmId)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;
