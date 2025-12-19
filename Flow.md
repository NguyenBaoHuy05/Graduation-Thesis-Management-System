# Project Flow & Walkthroughs

This document tracks the walkthroughs for implemented use cases.

## Usecase: Nộp đề cương (Submit Proposal)

**Implemented Capabilities:**

- **File Validation**: Restricts uploads to `.pdf` files only.
- **Submission Simulation**: Simulates an API call with loading state and success feedback.
- **Overwrite Protection**: Warns the user if they try to submit a new file when one already exists.
- **Status Updates**: UI reflects the submission status and time immediately after success (simulated).

### How to Verify

#### 1. Prerequisite

Ensure you are logged in as a **Student** who has an approved Topic Registration.

- **User**: `SV001` pass: `123` (Already has `in_progress` status in mock data)
- **User**: `SV004` pass: `123` (Status `outline_pending`)
- **User**: `SV005` pass: `123` (Status `registered` - **Best for First-time Submission**)

#### 2. Test Cases

##### Case A: First-time Submission (Happy Path)

1. Login as `SV005` / `123` (Role: Sinh viên).
2. Click on the **"Nộp đề cương"** tab in the sidebar.
3. Verify the form appears.
4. Click "Chọn file PDF" and select a valid `.pdf` file.
5. Click **"Nộp đề cương"**.
6. **Expectation**:
   - Button shows "Đang nộp..." spinner.
   - After ~1.5s, a **Success Popup** appears.
   - Closing the popup updates the status to "Đang chờ phản hồi" with the current time.

##### Case B: Overwrite Submission

1. Login as `SV001` / `123`.
2. Go to **"Nộp đề cương"**.
3. Select a new `.pdf` file.
4. Click **"Nộp đề cương"**.
5. **Expectation**:
   - A **"Ghi đè file cũ"** confirmation modal appears.
   - Clicking **"Hủy bỏ"** closes the modal without submitting.
   - Clicking **"Xác nhận"** proceeds to the loading state and Success Popup.

##### Case C: Invalid File

1.  Try to select a file that is not a PDF (e.g., image or text file).
2.  **Expectation**:
    - An error message "Vui lòng chỉ chọn file định dạng PDF" appears in red.
    - The "Nộp đề cương" button is disabled.

## Usecase: Quản lý giảng viên (Teacher Management)

**Implemented Capabilities:**

- **CRUD Operations**: Create, Read, Update, Delete teachers (using mock data).
- **Validation**: Basic form validation and existing logic checks (e.g., cannot delete active supervisors).
- **UI**: Added new "Teacher Management" tab for Secretary.

### How to Verify

#### 1. Prerequisite

- **User**: `SC001` (Secretary role)
- **Password**: `123`

#### 2. Test Cases

##### Case 1: View Teacher List

1. Login as Secretary.
2. Navigate to **"Quản lý giảng viên"**.
3. Verify list of teachers is displayed correctly.

##### Case 2: Add New Teacher

1. Click **"Thêm giảng viên"**.
2. Fill: `GV999`, `Nguyễn Văn Test`, `test@uni.edu.vn`.
3. Click **"Lưu giảng viên"**.
4. **Expectation**: Alert Success, new teacher appears in list.

##### Case 3: Edit Teacher

1. Find `GV999`. Click **Edit** (Blue Pen).
2. Modify info (e.g. phone).
3. Click **"Cập nhật"**.
4. **Expectation**: Alert Success, info updated.

##### Case 4: Delete Teacher

1. Click **Delete** (Red Trash Can) for `GV999`.
2. Confirm "Xóa giảng viên".
3. **Expectation**: Alert Success, teacher removed.

##### Case 5: Restriction Check

1. Try to delete active teacher (e.g. `GV001`).
2. **Expectation**: Alert "Không thể xóa giảng viên đang hướng dẫn...".

## Usecase: Quản lý sinh viên (Student Management)

**Implemented Capabilities:**

- **CRUD Operations**: Create, Read, Update, Delete students (using mock data).
- **Validation**: Basic form validation.
- **UI**: Added new "Student Management" tab for Secretary.

### How to Verify

#### 1. Prerequisite

- **User**: `SC001` (Secretary role)
- **Password**: `123`

#### 2. Test Cases

##### Case 1: View Student List

1. Login as Secretary.
2. Navigate to **"Quản lý sinh viên"**.
3. Verify list of students is displayed correctly.

##### Case 2: Add New Student

1. Click **"Thêm sinh viên"**.
2. Fill: `SV999`, `Trần Văn Test`, `CNTT`...
3. Click **"Lưu sinh viên"**.
4. **Expectation**: Alert Success, new student appears in list.

##### Case 3: Edit Student

1. Find `SV999`. Click **Edit** (Blue Pen).
2. Modify info (e.g. phone/GPA).
3. Click **"Cập nhật"**.
4. **Expectation**: Alert Success, info updated.

##### Case 4: Delete Student

1. Click **Delete** (Red Trash Can) for `SV999`.
2. Confirm "Xóa sinh viên".
3. **Expectation**: Alert Success, student removed.

## Usecase: Quản lý biểu mẫu (Form Management)

**Implemented Capabilities:**

- **Secretary**: CRUD operations for Forms.
- **Public**: Publicly accessible page listing forms for download.
- **Navigation**: "TRA CỨU BIỂU MẪU" link in main navbar.

### How to Verify

#### 1. Prerequisite

- **User**: `SC001` (Secretary for CRUD) / Any or Guest (for Public page)
- **Password**: `123`

#### 2. Test Cases

##### Case 1: Manage Forms (Secretary)

1. Login as `SC001`.
2. Navigate to **"Quản lý biểu mẫu"**.
3. **Add Form**: Click "Thêm biểu mẫu", enter "Mẫu Test 1", URL "/test.doc". Save.
   - Expect: New form appears in table.
4. **Edit Form**: Edit "Mẫu Test 1", change name to "Mẫu Test 2".
   - Expect: Name updated.
5. **Delete Form**: Delete "Mẫu Test 2".
   - Expect: Form removed.

##### Case 2: Public Access

1. Logout or open Incognito window.
2. On Homepage, click **"TRA CỨU BIỂU MẪU"** in the top navbar.
3. Verify you are taken to `/forms`.
4. Check that the list of forms (mock data) is displayed.
5. Click **"TẢI XUỐNG"** button on any row.
   - Expect: Link opens (in verification, it opens the mock URL).

## Usecase: Quản lý thông báo (Notification Management)

**Implemented Capabilities:**

- **Secretary**: CRUD operations for Notifications (Public & Internal).
- **Homepage**: Displays "Latest News" (Public notifications).
- **Header**: Bell icon displays "Internal" notifications for logged-in users.

### How to Verify

#### 1. Prerequisite

- **User**: `SC001` (Secretary) for Management.
- **User**: `SV001` (Student) for Header notification check.

#### 2. Test Cases

##### Case 1: Manage Notifications (Secretary)

1. Login as `SC001`.
2. Navigate to **"Quản lý thông báo"**.
3. **Add Notification**:
   - Title: "Thông báo nghỉ lễ"
   - Content: "Nghỉ lễ 2/9..."
   - Type: "Công khai" (Public).
   - Click Save.
   - Expect: Notification appears in list using "Globe" icon.
4. **Add Internal Notification**:
   - Title: "Họp nội bộ"
   - Content: "Họp lúc 9h..."
   - Type: "Nội bộ" (Internal).
   - Click Save.
   - Expect: Notification appears with "Lock" icon.

##### Case 2: Public Display (Homepage)

1. Logout.
2. Go to Homepage (`/`).
3. Check the **"Thông báo chung"** or **"Thông báo mới"** section.
4. Verify "Thông báo nghỉ lễ" is visible there.
5. Verify "Họp nội bộ" is **NOT** visible there.

##### Case 3: Internal Display (Logged In)

1. Login as `SV001`.
2. Look at the **Bell Icon** in the top right Header.
3. Expect a red badge count (if unsread).
4. Click Bell Icon.
5. Verify "Họp nội bộ" (or other internal mock notifications) are listed in the dropdown.
6. Verify "Thông báo nghỉ lễ" (Public) is **NOT** listed in the dropdown (depending on logic, usually internal is specific).

## Usecase: Quản lý danh sách đề tài (Topic Management)

**Implemented Capabilities:**

- **Department Head**: Full CRUD & Approval of Topics.
- **Dashboard**: Dedicated `/head` route and dashboard structure.

### How to Verify

#### 1. Prerequisite

- **User**: `HD001` (Trưởng Khoa - Head).
- **Password**: `123`.

#### 2. Test Cases

##### Case 1: Dashboard Access

1. Login with `HD001` / `123`.
2. Verify redirection to Head Dashboard (or navigate to `/head`).
3. Verify "Trưởng Khoa" title and "Quản lý danh sách đề tài" tab.

##### Case 2: Approve Topic

1. In "Quản lý danh sách đề tài", set filter to "Chờ duyệt" (Pending).
2. Find a pending topic (e.g. `DT006`).
3. Click **Approve (Green Check)**.
4. **Expectation**: A "Xác nhận duyệt" modal appears. Click **"Xác nhận"**.
5. Alert "Đã duyệt đề tài!" appears.
6. Filter by "Đã duyệt", verify topic status changed.

##### Case 3: Create Topic

1. Click **"Thêm đề tài"**.
2. Fill: "Đề tài thử nghiệm Head", Code: "DT_TEST", select Teacher.
3. Save.
4. Verify new topic appears in the list as "Đã duyệt" (since Head creates it).

##### Case 5: Reject Topic

1. Find a "Pending" topic.
2. Click **Reject (Red X)**.
3. **Expectation**: A "Xác nhận từ chối" modal appears. Click **"Xác nhận"**.
4. Alert "Đã từ chối đề tài!" appears.
5. Verify topic status changed to "Rejected".

##### Case 6: Delete Topic

1. Click **Delete** on "Đề tài thử nghiệm Head".
2. Confirm.
3. Verify topic is removed.
