import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const ProductModal = ({ product, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // Product categories
  const categories = [
    { value: 'FOOD', label: 'Food' },
    { value: 'TOYS', label: 'Toys' },
    { value: 'MEDICINE', label: 'Medicine' },
    { value: 'ACCESSORIES', label: 'Accessories' },
    { value: 'GROOMING', label: 'Grooming' },
  ];

  // Pet types
  const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Other'];

  // Age ranges
  const ageRanges = ['Puppy/Kitten', 'Adult', 'Senior', 'All Ages'];

  // Set default values when editing
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        category: product.category || 'FOOD',
        brand: product.brand || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stockQuantity: product.stockQuantity || 0,
        sku: product.sku || '',
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        ageRange: product.ageRange || '',
        petType: product.petType || '',
        ingredients: product.ingredients || '',
        usageInstructions: product.usageInstructions || '',
        imageUrl: product.imageUrl || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured !== undefined ? product.isFeatured : false,
      });
    }
  }, [product, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Convert string numbers to actual numbers
      const processedData = {
        ...data,
        price: parseFloat(data.price),
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        stockQuantity: parseInt(data.stockQuantity),
        weight: data.weight ? parseFloat(data.weight) : null,
      };
      await onSave(processedData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Product name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                type="text"
                {...register('shortDescription')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Brief description for product listing"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Detailed product description"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                {...register('brand')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Discount Price */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Discount Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register('discountPrice')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                {...register('stockQuantity', { required: 'Stock quantity is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                {...register('sku')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Product SKU"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Weight (grams)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('weight')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Dimensions (L x W x H)
              </label>
              <input
                type="text"
                {...register('dimensions')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 10 x 5 x 3 cm"
              />
            </div>

            {/* Pet Type */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Pet Type
              </label>
              <select
                {...register('petType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Pet Type</option>
                {petTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Age Range
              </label>
              <select
                {...register('ageRange')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Age Range</option>
                {ageRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                {...register('imageUrl')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Ingredients */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Ingredients
              </label>
              <textarea
                {...register('ingredients')}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="List of ingredients"
              />
            </div>

            {/* Usage Instructions */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Usage Instructions
              </label>
              <textarea
                {...register('usageInstructions')}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="How to use this product"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="block ml-2 text-sm text-gray-900">
                  Active Product
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  {...register('isFeatured')}
                  className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isFeatured" className="block ml-2 text-sm text-gray-900">
                  Featured Product
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 mt-6 space-x-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;