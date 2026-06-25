import { ImagePlus, Trash2, Upload, X } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { deleteImage, listImages, saveImage, type StoredImageRecord } from '../lib/image-store';
import { cn } from '../lib/utils';

type ImagePreview = {
  record: StoredImageRecord;
  url: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getImageFiles(files: FileList | File[]) {
  return Array.from(files).filter((file) => file.type.startsWith('image/'));
}

export function Component() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<StoredImageRecord[]>([]);
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [selected, setSelected] = useState<ImagePreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshImages() {
    setRecords(await listImages());
  }

  useEffect(() => {
    refreshImages().catch(() => setError('Could not load saved images from this browser.'));
  }, []);

  useEffect(() => {
    const nextPreviews = records.map((record) => ({
      record,
      url: URL.createObjectURL(record.blob),
    }));

    setPreviews(nextPreviews);
    setSelected((current) => nextPreviews.find((preview) => preview.record.id === current?.record.id) ?? null);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [records]);

  async function storeFiles(files: File[]) {
    const imageFiles = getImageFiles(files);
    if (imageFiles.length === 0) {
      setError('Choose at least one image file.');
      return;
    }

    setIsBusy(true);
    setError(null);
    try {
      await Promise.all(imageFiles.map((file) => saveImage(file)));
      await refreshImages();
    } catch {
      setError('The browser could not save those images. Storage may be full or unavailable.');
    } finally {
      setIsBusy(false);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    void storeFiles(Array.from(files));
    event.target.value = '';
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void storeFiles(Array.from(event.dataTransfer.files));
  }

  async function removeImage(id: string) {
    setIsBusy(true);
    setError(null);
    try {
      await deleteImage(id);
      await refreshImages();
    } catch {
      setError('Could not delete that image from browser storage.');
    } finally {
      setIsBusy(false);
    }
  }

  const totalSize = records.reduce((sum, record) => sum + record.size, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="violet">IndexedDB local storage</Badge>
          <h1 className="mt-4 text-3xl font-semibold text-white">Images</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Store image files in this browser for fast local previews without a backend.
          </p>
        </div>
        <Button variant="primary" onClick={() => inputRef.current?.click()} disabled={isBusy}>
          <Upload size={17} />
          Upload images
        </Button>
      </div>

      <input ref={inputRef} className="hidden" type="file" accept="image/*" multiple onChange={handleInputChange} />

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Local vault</CardTitle>
              <CardDescription>Images stay on this device and browser profile.</CardDescription>
            </div>
            <Badge tone="cyan">{records.length} saved</Badge>
          </CardHeader>

          <div
            className={cn(
              'grid min-h-56 place-items-center rounded-lg border border-dashed border-white/15 bg-slate-950/45 p-6 text-center transition',
              isDragging && 'border-cyan-300/60 bg-cyan-300/10',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-white/[0.06] text-cyan-200">
                <ImagePlus size={22} />
              </div>
              <p className="mt-4 text-sm font-medium text-white">Drop images here</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">PNG, JPG, GIF, SVG, and other browser-supported image formats.</p>
              <Button className="mt-5" variant="secondary" onClick={() => inputRef.current?.click()} disabled={isBusy}>
                Choose files
              </Button>
              {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <p className="text-slate-500">Stored</p>
              <p className="mt-1 font-medium text-white">{records.length} images</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <p className="text-slate-500">Used</p>
              <p className="mt-1 font-medium text-white">{formatBytes(totalSize)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Saved images are loaded back from IndexedDB.</CardDescription>
            </div>
          </CardHeader>

          {previews.length === 0 ? (
            <div className="grid min-h-72 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-center">
              <div>
                <p className="text-sm font-medium text-white">No images saved yet</p>
                <p className="mt-2 text-sm text-slate-400">Upload one to see the local gallery come alive.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {previews.map((preview) => (
                <article key={preview.record.id} className="group overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
                  <button className="block aspect-[4/3] w-full bg-white/[0.03]" onClick={() => setSelected(preview)}>
                    <img className="h-full w-full object-cover" src={preview.url} alt={preview.record.name} />
                  </button>
                  <div className="space-y-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{preview.record.name}</p>
                      <p className="text-xs text-slate-500">{formatBytes(preview.record.size)}</p>
                    </div>
                    <Button className="w-full" variant="ghost" size="sm" onClick={() => void removeImage(preview.record.id)} disabled={isBusy}>
                      <Trash2 size={15} />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{selected.record.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(selected.record.size)}</p>
              </div>
              <Button size="icon" variant="ghost" aria-label="Close preview" onClick={() => setSelected(null)}>
                <X size={18} />
              </Button>
            </div>
            <div className="max-h-[75vh] bg-black/30 p-3">
              <img className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain" src={selected.url} alt={selected.record.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
