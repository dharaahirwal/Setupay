# First Time Setup Guide

## ⚠️ Important: Set UPI PIN Before Sending Money

After logging in for the first time, you **must set your UPI PIN** before you can send money.

### Quick Setup Steps

1. **Login** to the app
2. **Go to Settings** (tap Settings from home or use bottom navigation)
3. **Set UPI PIN**:
   - Tap "🔐 Set UPI PIN"
   - Enter a 4-6 digit PIN
   - Confirm the PIN
   - Enter your account password for verification
   - Tap "Set PIN"

4. **Start Sending Money!**
   - Now you can send money to other users
   - Your UPI PIN will be required for each transaction

### Test Accounts

After running `npm run seed`, you'll have these accounts:

| Username | Password | Balance | UPI ID |
|----------|----------|---------|--------|
| __.dharaa._ | dhara2005 | ₹2,000 | __.dharaa._@dbl |
| adityasingh03rajput | aditya2005 | ₹2,00,000 | adityasingh03rajput@dbl |

**Note:** UPI PINs are NOT set by default. Each user must set their own PIN.

### Why This Error Happens

If you try to send money without setting a UPI PIN, you'll get:
```
POST /api/payment/send 500
Error: "Please set your UPI PIN first"
```

### Solution

1. Open PayApp
2. Tap your profile or go to Settings
3. Expand "Set UPI PIN" section
4. Set a 4-6 digit PIN (e.g., 1234)
5. Confirm with your account password
6. Done! Now you can send money

### For Testing

If you want to quickly test payments:

**User 1 (Dhara):**
1. Login: `__.dharaa._` / `dhara2005`
2. Go to Settings
3. Set UPI PIN: `1234`
4. Password: `dhara2005`

**User 2 (Aditya):**
1. Login: `adityasingh03rajput` / `aditya2005`
2. Go to Settings
3. Set UPI PIN: `1234`
4. Password: `aditya2005`

Now you can send money between these accounts!

### Features That Require UPI PIN

- ✅ Send Money
- ✅ Pay via UPI ID
- ✅ QR Code Payments

### Features That DON'T Require UPI PIN

- ✅ View Balance
- ✅ View Transactions
- ✅ Generate QR Code
- ✅ Receive Money
- ✅ Search Users

## Common Issues

### "Please set your UPI PIN first"
**Solution:** Go to Settings → Set UPI PIN

### "Incorrect UPI PIN"
**Solution:** Make sure you're entering the correct PIN you set

### "Insufficient balance"
**Solution:** Check your balance. You need enough funds to send.

### Transaction Failed (500 error)
**Possible causes:**
1. UPI PIN not set → Set it in Settings
2. MongoDB not running → Start MongoDB service
3. Backend server not running → Run `npm run dev` in backend folder

## Quick Test Flow

```bash
# 1. Start MongoDB
Start-Service MongoDB

# 2. Start Backend
cd backend
npm run dev

# 3. In app:
# - Login as __.dharaa._
# - Go to Settings
# - Set UPI PIN: 1234
# - Go back to Home
# - Tap "Send Money"
# - Search: adityasingh03rajput
# - Enter amount: 100
# - Enter PIN: 1234
# - Success!
```

## Security Note

- UPI PINs are hashed using bcrypt (same as passwords)
- PINs are never stored in plain text
- Each transaction requires PIN verification
- PINs are 4-6 digits for security and convenience

---

**Ready to start?** Set your UPI PIN and enjoy seamless payments! 🚀
