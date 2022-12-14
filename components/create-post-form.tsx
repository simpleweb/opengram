import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

type FormData = {
  image: File;
  name: string;
  description: string;
  metadata: {
    camera?: string;
    aperture?: string;
    focalLength?: string;
    iso?: string;
  };
};

interface Props {
  onSubmit: (formData: FormData) => Promise<void>;
}

function CreatePostForm({ onSubmit }: Props) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const name = useTextInput();
  const description = useTextInput();
  const image = useImage();
  const camera = useTextInput();
  const aperture = useTextInput();
  const focalLength = useTextInput();
  const iso = useTextInput();

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setError(undefined);

      if (!image.value) {
        throw new Error("No image selected");
      }
      if (!name.value) {
        throw new Error("Please enter a name");
      }
      if (!description.value) {
        throw new Error("Please enter a description");
      }

      await onSubmit({
        image: image.value,
        name: name.value,
        description: description.value,
        metadata: {
          camera: camera.value,
          aperture: aperture.value,
          focalLength: focalLength.value,
          iso: iso.value,
        },
      });

      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Couldn't create post";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <fieldset disabled={isSubmitting} className="space-y-8">
          <div>
            <div className="h-[470px] bg-[#f2f2f2] relative">
              {image.previewUrl && (
                <img
                  src={image.previewUrl}
                  width={470}
                  height={470}
                  alt="Image preview"
                  className="object-contain h-[470px]"
                />
              )}
              <label
                htmlFor="image"
                className={`absolute inset-0 items-center justify-center underline font-medium text-indigo-600 hover:cursor-pointer ${
                  image.value ? "sr-only" : "flex"
                }`}
              >
                Upload image
              </label>
            </div>
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              name="image"
              id="image"
              required
              {...image.input}
            />
          </div>

          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                className="input"
                required
                {...name.input}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                className="input"
                required
                {...description.input}
              />
            </div>
          </div>

          <h3 className="uppercase text-sm text-gray-500">
            Photo Metadata (optional)
          </h3>

          <div>
            <label htmlFor="camera" className="label">
              Camera
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="camera"
                id="camera"
                className="input"
                {...camera.input}
              />
            </div>
          </div>

          <div>
            <label htmlFor="aperture" className="label">
              Aperture
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="aperture"
                id="aperture"
                className="input"
                {...aperture.input}
              />
            </div>
          </div>

          <div>
            <label htmlFor="focalLength" className="label">
              Focal length
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="focalLength"
                id="focalLength"
                className="input"
                {...focalLength.input}
              />
            </div>
          </div>

          <div>
            <label htmlFor="iso" className="label">
              ISO
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="iso"
                id="iso"
                className="input"
                {...iso.input}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 py-4 px-6 rounded-md">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          )}
        </fieldset>
      </form>
    </>
  );
}

function useImage() {
  const [image, setImage] = useState<File | null | undefined>(null);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const inputImage = event.target.files?.item(0);
    setImage(inputImage);
  }

  const imagePreviewUrl = image ? URL.createObjectURL(image) : undefined;

  return {
    value: image,
    previewUrl: imagePreviewUrl,
    input: {
      onChange,
    },
  };
}

function useTextInput(initialValue?: string) {
  const [text, setText] = useState<undefined | string>(initialValue);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  return {
    value: text,
    input: {
      onChange,
    },
  };
}

export default CreatePostForm;
