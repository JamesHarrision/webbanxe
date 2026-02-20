'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadService } from '@/services/upload.service';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Nhập mô tả chi tiết...',
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const editorRef = useRef<any>(null);

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || '';

  return (
    <Editor
      apiKey={apiKey}
      onInit={(_evt, editor) => {
        editorRef.current = editor;
      }}
      value={value}
      onEditorChange={(newValue) => {
        onChange?.(newValue);
      }}
      init={{
        height: 400,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
          'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount',
        ],
        toolbar:
          'undo redo | blocks | bold italic forecolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image | ' +
          'removeformat | code fullscreen',
        placeholder,
        // ── Image upload handler ──
        images_upload_handler: async (blobInfo: any) => {
          const url = await uploadService.uploadTinymceImage(blobInfo.blob());
          return url;
        },
        automatic_uploads: true,
        file_picker_types: 'image',
        // Vietnamese language
        language: 'vi',
        language_url: '/tinymce/langs/vi.js',
        // Styling
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }',
        branding: false,
      }}
    />
  );
};

export default RichTextEditor;
