import { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import DOMPurify from "dompurify";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { getUserCmsList, updateUserCms } from "../../service/userCms";

const EMPTY_CONTENT = {
  aboutUs: "",
  terms_Conditions: "",
  privacyPolicy: "",
};

const CONTENT_FIELDS = [
  { key: "aboutUs", label: "About Us" },
  { key: "terms_Conditions", label: "Terms & Conditions" },
  { key: "privacyPolicy", label: "Privacy Policy" },
];

const sanitizeContent = (html) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "blockquote",
      "br",
      "div",
      "em",
      "h1",
      "h2",
      "h3",
      "i",
      "li",
      "ol",
      "p",
      "span",
      "strong",
      "u",
      "ul",
    ],
    ALLOWED_ATTR: ["href", "rel", "target"],
  });

const hasTextContent = (html) =>
  Boolean(
    new DOMParser()
      .parseFromString(html, "text/html")
      .body.textContent?.trim()
  );

export default function UserCms() {
  const [record, setRecord] = useState(null);
  const [content, setContent] = useState(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadCms = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await getUserCmsList();
      if (response?.status === false) {
        throw new Error(response.message || "Failed to fetch CMS content");
      }

      const cmsRecord = Array.isArray(response?.data) ? response.data[0] : null;
      setRecord(cmsRecord || null);
      setContent(
        cmsRecord
          ? {
              aboutUs: sanitizeContent(cmsRecord.aboutUs || ""),
              terms_Conditions: sanitizeContent(cmsRecord.terms_Conditions || ""),
              privacyPolicy: sanitizeContent(cmsRecord.privacyPolicy || ""),
            }
          : EMPTY_CONTENT
      );
    } catch (error) {
      setLoadError(error.message || "Failed to load CMS content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCms();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!record?._id) {
      toast.error("No CMS record is available to update");
      return;
    }

    const payload = {
      aboutUs: sanitizeContent(content.aboutUs),
      terms_Conditions: sanitizeContent(content.terms_Conditions),
      privacyPolicy: sanitizeContent(content.privacyPolicy),
    };

    if (Object.values(payload).some((value) => !hasTextContent(value))) {
      toast.error("Please fill in all CMS fields");
      return;
    }

    setSaving(true);
    try {
      const response = await updateUserCms(record._id, payload);
      if (response?.status === false) {
        throw new Error(response.message || "Unable to update CMS content");
      }

      toast.success(response?.message || "CMS content updated successfully");
      await loadCms();
    } catch (error) {
      toast.error(error.message || "Unable to update CMS content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">User CMS</h1>
          <p className="mt-1 text-sm text-gray-500">
            Edit the content shown to your users.
          </p>
        </div>

        {loadError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{loadError}</p>
            <button
              type="button"
              onClick={loadCms}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
            Loading CMS content...
          </p>
        ) : !record ? (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
            No CMS record was found. There is no content to update.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="mb-5 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit CMS content
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Format the content with the rich-text toolbar. All sections are
                required.
              </p>
            </div>

            <div className="space-y-5">
              {CONTENT_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label
                    htmlFor={`cms-${key}`}
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  <EditorProvider>
                    <Editor
                      id={`cms-${key}`}
                      value={content[key]}
                      onChange={(event) =>
                        setContent((current) => ({
                          ...current,
                          [key]: sanitizeContent(event.target.value),
                        }))
                      }
                      containerProps={{
                        className:
                          "rounded-lg border border-gray-300 focus-within:border-blue-500",
                      }}
                    >
                      <Toolbar>
                        <BtnStyles />
                        <Separator />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnLink />
                        <Separator />
                        <BtnBulletList />
                        <BtnNumberedList />
                        <Separator />
                        <BtnClearFormatting />
                      </Toolbar>
                    </Editor>
                  </EditorProvider>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Updating..." : "Update CMS"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
