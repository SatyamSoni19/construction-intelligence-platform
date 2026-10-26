import { useDropzone } from 'react-dropzone'
import { ImagePlus, X } from 'lucide-react'

export default function ImageUpload({ file, onChange, required }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
        maxFiles: 1,
        maxSize: 8 * 1024 * 1024,
        onDrop: (files) => files[0] && onChange(files[0]),
    })

    if (file) {
        return (
            <div className="relative overflow-hidden rounded-xl border border-slate-200">
                <img src={URL.createObjectURL(file)} alt="Preview" className="h-56 w-full object-cover" />
                <button type="button" onClick={() => onChange(null)}
                    className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1.5 text-white hover:bg-slate-900">
                    <X size={16} />
                </button>
            </div>
        )
    }

    return (
        <div {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${isDragActive ? 'border-amber-500 bg-amber-50' : 'border-slate-300 bg-slate-50 hover:border-amber-400'
                }`}>
            <input {...getInputProps()} />
            <ImagePlus className="mb-2 text-slate-400" size={32} />
            <p className="text-sm font-medium text-slate-700">Drag & drop an image, or click to browse</p>
            <p className="mt-1 text-xs text-slate-500">JPG, PNG or WEBP, up to 8 MB {required ? '(required)' : '(optional)'}</p>
        </div>
    )
}