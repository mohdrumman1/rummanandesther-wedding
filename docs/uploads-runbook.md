# Guest uploads runbook (Cloudflare R2)

Run from the repo root.

## 1. Set up R2

1. Cloudflare dashboard > R2 > enable R2 (add a billing alert: Billing > Notifications, e.g. $5).
2. Create the bucket:
   ```sh
   npx wrangler r2 bucket create wedding-media
   ```
3. Create an R2 API token: R2 > Manage API tokens > Create token. Permission **Object Read & Write**, scope **Apply to specific bucket: wedding-media** only. Save the Access Key ID, Secret Access Key and your Account ID.
4. Apply CORS:
   ```sh
   npx wrangler r2 bucket cors set wedding-media --file worker/r2-cors.json
   ```
5. Abort incomplete multipart uploads after 7 days (check `npx wrangler r2 bucket lifecycle add --help` for flags, or use dashboard: bucket > Settings > Lifecycle rules):
   ```sh
   npx wrangler r2 bucket lifecycle add wedding-media abort-multipart-7d --abort-multipart-days 7
   ```

## 2. Worker secrets and deploy

```sh
npx wrangler secret put R2_ACCOUNT_ID --config worker/wrangler.toml
npx wrangler secret put R2_ACCESS_KEY_ID --config worker/wrangler.toml
npx wrangler secret put R2_SECRET_ACCESS_KEY --config worker/wrangler.toml
npx wrangler secret put UPLOAD_CODE --config worker/wrangler.toml
npm run worker:migrate:remote
npm run worker:deploy
```

Then deploy the site as usual.

## 3. QR sign

Open `https://rummanandesther.com/share-sign?c=CODE` (CODE = the upload code), print it from the browser (Cmd+P), and place it at the entrance.

## 4. Pre-wedding real-device test checklist

Test on the live URL with the real code.

- [ ] iPhone Safari upload
- [ ] iPhone Chrome upload
- [ ] Android Chrome upload
- [ ] Instagram in-app browser (open the link from a DM or story)
- [ ] HEIC photo: uploads, and the original sha256 and EXIF match after download
- [ ] Live Photo: still image uploads; compare sha256 and EXIF
- [ ] 1 GB 4K video: uploads; compare sha256 after download
- [ ] Lock the phone mid-upload, then unlock: upload resumes and completes
- [ ] Airplane mode mid-upload, then restore network: upload resumes and completes
- [ ] 10+ phones uploading at the same time: all complete
- [ ] Wrong code is rejected
- [ ] Oversized file is rejected with a clear message
- [ ] Full download of the bucket with rclone (section 6) completes and counts match

## 5. Billing and access checks

- Confirm the billing alert fires (set a low test threshold once, then restore it).
- Confirm the API token only lists `wedding-media` (token scope).

## 6. Post-wedding backup

Install rclone, then add this remote to `~/.config/rclone/rclone.conf`:

```ini
[r2]
type = s3
provider = Cloudflare
access_key_id = <R2_ACCESS_KEY_ID>
secret_access_key = <R2_SECRET_ACCESS_KEY>
endpoint = https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com
acl = private
```

Copy and verify:

```sh
rclone copy r2:wedding-media ./wedding --checksum
rclone check r2:wedding-media ./wedding --one-way
```

Keep two copies (for example an external drive and cloud storage) before continuing.

## 7. Cleanup

1. Confirm both backup copies open and match (`rclone check` passes).
2. Revoke the R2 API token in the dashboard.
3. Delete the bucket only after step 1 and 2 are done:
   ```sh
   npx wrangler r2 bucket delete wedding-media
   ```
   (The bucket must be empty; delete its objects first if the command refuses.)
