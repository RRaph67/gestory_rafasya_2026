# TODO - Sinkronisasi Backend(Database) ↔ Frontend

## Step 1: Audit & kontrak data
- [x] Cek backend routes (router.go) dan handler course/quiz
- [x] Cek backend response wrapper (response.go) dan DTO (course.go, quiz.go)
- [x] Cek frontend services (api.ts, courseService.ts, quizService.ts, gameService.ts)
- [x] Validasi ada/tidaknya endpoint `GET /api/v1/quiz/progress/:courseId`

## Step 2: Refactor frontend supaya mengambil data real
- [x] Ubah `gestory/src/services/api.ts` agar memakai axios real dan `USE_MOCK=false`
- [ ] Hapus override mock pada `gestory/src/services/courseService.ts`
- [ ] Hapus override mock pada `gestory/src/services/quizService.ts`
- [ ] Hapus mock pada `gestory/src/services/gameService.ts`



## Step 3: Samakan endpoint progress
- [ ] Pilih implementasi: tambah backend route progress ATAU hapus dari frontend
- [ ] Jika tambah backend: buat handler/service/repo untuk membaca dari `quiz_results`
- [ ] Jika hapus dari frontend: hapus penggunaan `getQuizProgress`

## Step 4: Samakan mapping request/response
- [ ] Pastikan shape quiz pertanyaan: `options` (map) dan field `correctAnswer`/`explanation`
- [ ] Pastikan field course: `id` dipakai sebagai `slug` sesuai backend
- [ ] Pastikan submit quiz: `courseId` = slug, `questionId` = uuid string

## Step 5: Testing manual
- [ ] Jalankan backend dan frontend
- [ ] Buka dashboard -> list course
- [ ] Buka course detail -> sections & questions
- [ ] Main quiz -> submit -> tampilkan score

