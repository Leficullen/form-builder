import { User, Form, Question, FormResponse } from "./types";

export const DUMMY_USERS: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
];

export const DUMMY_FORMS: Form[] = [
  {
    id: "1",
    title: "Survey Pelayanan Rumah Sakit",
    description:
      "Survey ini ditujukan bagi para pengunjung / pasien Rumah Sakit Dadi",
    creatorId: "user-1",
    isPublished: true,
    questionCount: 5,
    date: "21/02/2026",
    bannerColor: "#3e2e85",
  },
  {
    id: "2",
    title: "Feedback Event Campus",
    description:
      "Kumpulkan tanggapan dari peserta mengenai acara 'Tech Talk 2026' yang baru saja selesai.",
    creatorId: "user-1",
    isPublished: false,
    questionCount: 12,
    date: "15/02/2026",
    bannerColor: "#1e293b",
  },
  {
    id: "3",
    title: "Survey Kepuasan Pelanggan",
    description:
      "Kumpulkan tanggapan dari pelanggan mengenai layanan yang diberikan.",
    creatorId: "user-2",
    isPublished: true,
    questionCount: 5,
    date: "10/02/2026",
    bannerColor: "#059669",
  },
  {
    id: "4",
    title: "Feedback Acara Kampus",
    description:
      "Kumpulkan tanggapan dari peserta mengenai acara 'Tech Talk 2026' yang baru saja selesai.",
    creatorId: "user-2",
    isPublished: false,
    questionCount: 8,
    date: "05/02/2026",
    bannerColor: "#b91c1c",
  },
];

export const DUMMY_QUESTIONS: Question[] = [
  {
    id: "q1",
    formId: "1",
    type: "SHORT ANSWER",
    title: "Apakah saya ganteng?",
    required: true,
  },
  {
    id: "q2",
    formId: "1",
    type: "PARAGRAPH",
    title: "Ceritakan pengalaman Anda di rumah sakit kami",
    required: true,
  },
  {
    id: "q3",
    formId: "1",
    type: "MULTIPLE CHOICE",
    title: "Bagaimana kebersihan fasilitas kami?",
    required: true,
    options: ["Sangat Bersih", "Bersih", "Cukup", "Kurang"],
  },
  {
    id: "q4",
    formId: "1",
    type: "CHECKBOXES",
    title: "Layanan apa saja yang Anda gunakan?",
    required: true,
    options: ["UGD", "Rawat Jalan", "Farmasi", "Laboratorium"],
  },
  {
    id: "q5",
    formId: "1",
    type: "DROPDOWN",
    title: "Pilih dokter yang menangani Anda",
    required: true,
    options: ["Dr. Andi", "Dr. Budi", "Dr. Citra"],
  },
];

export const DUMMY_RESPONSES: FormResponse[] = [
  {
    id: "res1",
    formId: "1",
    questionId: "q1",
    type: "SHORT TEXT",
    responsesCount: 3,
    answers: ["Menurutku sih tidak", "Sepertinya iya", "Terserah"],
  },
  {
    id: "res2",
    formId: "1",
    questionId: "q2",
    type: "PARAGRAPH",
    responsesCount: 3,
    answers: [
      "Pelayanan cukup cepat tapi antrian obat lama.",
      "Dokternya sangat ramah dan informatif.",
      "Fasilitas parkir perlu ditingkatkan.",
    ],
  },
  {
    id: "res3",
    formId: "1",
    questionId: "q3",
    type: "MULTIPLE CHOICE",
    responsesCount: 3,
    stats: [
      {
        label: "Sangat Bersih",
        count: 1,
        percentage: "33,33%",
        color: "bg-[#6be0ff]",
      },
      {
        label: "Bersih",
        count: 1,
        percentage: "33,33%",
        color: "bg-[#b1229f]",
      },
      { label: "Cukup", count: 1, percentage: "33,33%", color: "bg-[#ffdf6b]" },
    ],
  },
  {
    id: "res4",
    formId: "1",
    questionId: "q4",
    type: "CHECKBOXES",
    responsesCount: 3,
    stats: [
      { label: "UGD", count: 1, percentage: "25%", color: "bg-[#6be0ff]" },
      {
        label: "Rawat Jalan",
        count: 2,
        percentage: "50%",
        color: "bg-[#b1229f]",
      },
      { label: "Farmasi", count: 1, percentage: "25%", color: "bg-[#ffdf6b]" },
    ],
  },
  {
    id: "res5",
    formId: "1",
    questionId: "q5",
    type: "DROPDOWN",
    responsesCount: 3,
    stats: [
      {
        label: "Dr. Andi",
        count: 1,
        percentage: "33,33%",
        color: "bg-[#6be0ff]",
      },
      {
        label: "Dr. Budi",
        count: 1,
        percentage: "33,33%",
        color: "bg-[#b1229f]",
      },
      {
        label: "Dr. Citra",
        count: 1,
        percentage: "33,33%",
        color: "bg-[#ffdf6b]",
      },
    ],
  },
];

export const getFormById = (id: string) => DUMMY_FORMS.find((f) => f.id === id);
export const getQuestionsByFormId = (formId: string) =>
  DUMMY_QUESTIONS.filter((q) => q.formId === formId);
export const getResponsesByFormId = (formId: string) =>
  DUMMY_RESPONSES.filter((r) => r.formId === formId);
export const getUserById = (id: string) => DUMMY_USERS.find((u) => u.id === id);
