# Print Jobs REST API Documentation

This REST API allows you to manage printer connections and print jobs for NIIMBOT printers.

## Base URL

```
https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1
```

## Endpoints

### 1. Submit Print Job

Creates a new print job with printer connection details and image data.

**Endpoint:** `POST /submit-print-job`

**Request Body:**
```json
{
  "printerAddress": "27:03:07:17:6e:82",
  "printerType": "bluetooth",
  "printerModel": "B1",
  "imageData": "data:image/png;base64,iVBORw0KG...",
  "printSettings": {
    "density": 3,
    "quantity": 1,
    "labelType": 1,
    "printTaskName": "D110",
    "threshold": 140,
    "postProcess": "threshold"
  },
  "userId": "optional-user-id"
}
```

**Parameters:**
- `printerAddress` (required): Bluetooth MAC address or serial port name
- `printerType` (required): Connection type - `bluetooth`, `serial`, or `capacitor-ble`
- `printerModel` (optional): Printer model name (e.g., B1, D110, B21_C2B)
- `imageData` (required): Base64-encoded image data or data URL
- `printSettings` (optional): Object containing print configuration
  - `density`: Print density (1-20, typically 1-5)
  - `quantity`: Number of copies to print
  - `labelType`: Label type enum value
  - `printTaskName`: Print task version (B1, D110, etc.)
  - `threshold`: Threshold value for image processing (1-255)
  - `postProcess`: Post-processing type (threshold, dither)
- `userId` (optional): User identifier for tracking

**Response (201 Created):**
```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "createdAt": "2025-10-02T12:34:56.789Z"
}
```

**Example:**
```bash
curl -X POST https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/submit-print-job \
  -H "Content-Type: application/json" \
  -d '{
    "printerAddress": "27:03:07:17:6e:82",
    "printerType": "bluetooth",
    "printerModel": "B1",
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "printSettings": {
      "density": 3,
      "quantity": 1
    }
  }'
```

---

### 2. Get Print Jobs

Retrieves print jobs with optional filtering.

**Endpoint:** `GET /get-print-jobs`

**Query Parameters:**
- `id` (optional): Get a specific job by ID
- `status` (optional): Filter by status - `pending`, `processing`, `completed`, `failed`, `cancelled`
- `userId` (optional): Filter by user ID
- `limit` (optional): Maximum number of jobs to return (default: 50)

**Response (200 OK) - Multiple Jobs:**
```json
{
  "jobs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2025-10-02T12:34:56.789Z",
      "updated_at": "2025-10-02T12:35:00.123Z",
      "status": "completed",
      "printer_address": "27:03:07:17:6e:82",
      "printer_type": "bluetooth",
      "printer_model": "B1",
      "image_data": "data:image/png;base64,...",
      "print_settings": {
        "density": 3,
        "quantity": 1
      },
      "error_message": null,
      "user_id": null
    }
  ],
  "count": 1
}
```

**Response (200 OK) - Single Job:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-10-02T12:34:56.789Z",
  "updated_at": "2025-10-02T12:35:00.123Z",
  "status": "completed",
  "printer_address": "27:03:07:17:6e:82",
  "printer_type": "bluetooth",
  "printer_model": "B1",
  "image_data": "data:image/png;base64,...",
  "print_settings": {
    "density": 3,
    "quantity": 1
  },
  "error_message": null,
  "user_id": null
}
```

**Examples:**
```bash
# Get all jobs
curl https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/get-print-jobs

# Get pending jobs only
curl https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/get-print-jobs?status=pending

# Get specific job by ID
curl https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/get-print-jobs?id=550e8400-e29b-41d4-a716-446655440000

# Get jobs for a specific user
curl https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/get-print-jobs?userId=user-123

# Limit results
curl https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/get-print-jobs?limit=10
```

---

### 3. Update Print Job

Updates the status of a print job.

**Endpoint:** `PUT /update-print-job` or `PATCH /update-print-job`

**Request Body:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "errorMessage": "Error details if failed"
}
```

**Parameters:**
- `id` (required): Print job ID
- `status` (optional): New status - `pending`, `processing`, `completed`, `failed`, `cancelled`
- `errorMessage` (optional): Error message if status is `failed`

**Response (200 OK):**
```json
{
  "success": true,
  "job": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-10-02T12:34:56.789Z",
    "updated_at": "2025-10-02T12:35:00.123Z",
    "status": "completed",
    "printer_address": "27:03:07:17:6e:82",
    "printer_type": "bluetooth",
    "printer_model": "B1",
    "image_data": "data:image/png;base64,...",
    "print_settings": {
      "density": 3,
      "quantity": 1
    },
    "error_message": null,
    "user_id": null
  }
}
```

**Example:**
```bash
curl -X PUT https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/update-print-job \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed"
  }'
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - HTTP method not supported
- `500 Internal Server Error` - Server error

---

## Workflow

### Typical Print Job Workflow

1. **Submit a print job** using `POST /submit-print-job`
   - Provide printer connection details and image data
   - Receive a job ID in the response

2. **Client polls for jobs** using `GET /get-print-jobs?status=pending`
   - Client with printer access checks for pending jobs
   - Jobs can be filtered by status, user, etc.

3. **Client processes the job**
   - Client connects to the printer using the provided connection details
   - Client sends the image data to the printer

4. **Update job status** using `PUT /update-print-job`
   - Set status to `processing` when starting
   - Set status to `completed` when finished successfully
   - Set status to `failed` with error message if printing fails

---

## Integration Examples

### JavaScript/TypeScript

```typescript
// Submit a print job
async function submitPrintJob(imageData: string, printerAddress: string) {
  const response = await fetch(
    'https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/submit-print-job',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        printerAddress,
        printerType: 'bluetooth',
        imageData,
        printSettings: {
          density: 3,
          quantity: 1
        }
      })
    }
  );

  return await response.json();
}

// Get pending jobs
async function getPendingJobs() {
  const response = await fetch(
    'https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/get-print-jobs?status=pending'
  );

  return await response.json();
}

// Update job status
async function updateJobStatus(jobId: string, status: string) {
  const response = await fetch(
    'https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1/update-print-job',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jobId, status })
    }
  );

  return await response.json();
}
```

### Python

```python
import requests
import json
import base64

BASE_URL = 'https://qpnvgurndmrdyasjvsfn.supabase.co/functions/v1'

# Submit a print job
def submit_print_job(image_path, printer_address):
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode()

    response = requests.post(
        f'{BASE_URL}/submit-print-job',
        json={
            'printerAddress': printer_address,
            'printerType': 'bluetooth',
            'imageData': f'data:image/png;base64,{image_data}',
            'printSettings': {
                'density': 3,
                'quantity': 1
            }
        }
    )

    return response.json()

# Get pending jobs
def get_pending_jobs():
    response = requests.get(f'{BASE_URL}/get-print-jobs?status=pending')
    return response.json()

# Update job status
def update_job_status(job_id, status):
    response = requests.put(
        f'{BASE_URL}/update-print-job',
        json={'id': job_id, 'status': status}
    )
    return response.json()
```

---

## Notes

- The API uses CORS and is accessible from any origin
- No authentication is required (public access enabled)
- Image data should be provided as base64-encoded data URLs
- The API stores print jobs in a Supabase database
- Actual printing requires a client with hardware access (Web Bluetooth, Web Serial, or native BLE)
- For production use, consider adding authentication and rate limiting
