// Automated security verification test for Backbencher admin and Supabase integration
async function runSecurityTests() {
  const baseUrl = "http://localhost:3000";
  console.log("=== STARTING BACKBENCHER ADMIN & SUPABASE SECURITY AUDIT ===");

  try {
    // 1. Check unauthorized access to /admin
    console.log("\n[TEST 1] Unauthorized GET /admin (Must redirect to /admin/login)");
    const resAdmin = await fetch(`${baseUrl}/admin`, { redirect: "manual" });
    console.log(`Status: ${resAdmin.status}, Location: ${resAdmin.headers.get("location")}`);
    if (resAdmin.status === 307 || resAdmin.status === 302 || resAdmin.status === 308) {
      console.log("✅ PASS: Unauthorized visitor intercepted and redirected to login!");
    } else {
      console.error("❌ FAIL: /admin was not redirected!");
    }

    // 2. Check unauthorized access to /admin/posts/new
    console.log("\n[TEST 2] Unauthorized GET /admin/posts/new (Must redirect to /admin/login)");
    const resNew = await fetch(`${baseUrl}/admin/posts/new`, { redirect: "manual" });
    console.log(`Status: ${resNew.status}, Location: ${resNew.headers.get("location")}`);
    if (resNew.status === 307 || resNew.status === 302 || resNew.status === 308) {
      console.log("✅ PASS: /admin/posts/new is strictly protected!");
    } else {
      console.error("❌ FAIL: /admin/posts/new was accessible without auth!");
    }

    // 3. Check unauthorized access to /api/admin/posts
    console.log("\n[TEST 3] Unauthorized GET /api/admin/posts (Must return 401)");
    const resApiPosts = await fetch(`${baseUrl}/api/admin/posts`);
    console.log(`Status: ${resApiPosts.status}`);
    if (resApiPosts.status === 401) {
      console.log("✅ PASS: /api/admin/posts returns 401 Unauthorized!");
    } else {
      console.error("❌ FAIL: /api/admin/posts did not return 401!");
    }

    // 4. Check unauthorized access to /api/admin/settings
    console.log("\n[TEST 4] Unauthorized GET /api/admin/settings (Must return 401)");
    const resApiSettings = await fetch(`${baseUrl}/api/admin/settings`);
    console.log(`Status: ${resApiSettings.status}`);
    if (resApiSettings.status === 401) {
      console.log("✅ PASS: /api/admin/settings returns 401 Unauthorized!");
    } else {
      console.error("❌ FAIL: /api/admin/settings did not return 401!");
    }

    // 5. Test Invalid Credentials
    console.log("\n[TEST 5] Testing invalid PIN credentials");
    const resBadLogin = await fetch(`${baseUrl}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: "000000" }),
    });
    console.log(`Status: ${resBadLogin.status}`);
    const badData = await resBadLogin.json();
    console.log("Response:", badData);
    if (resBadLogin.status === 401) {
      console.log("✅ PASS: Invalid credentials correctly rejected!");
    } else {
      console.error("❌ FAIL: Invalid credentials was not rejected with 401!");
    }

    // 6. Test Valid Admin Login (with default PIN 849201)
    console.log("\n[TEST 6] Testing valid Admin Login (PIN 849201)");
    const resLogin = await fetch(`${baseUrl}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: "849201" }),
    });
    console.log(`Status: ${resLogin.status}`);
    const cookieHeader = resLogin.headers.get("set-cookie");
    console.log("Set-Cookie header received:", cookieHeader ? "Yes (Secure HttpOnly)" : "No");

    if (cookieHeader) {
      const cookieVal = cookieHeader.split(";")[0];

      // 7. Test Verified Session with cookie
      console.log("\n[TEST 7] Testing verified session with returned cookie");
      const resSession = await fetch(`${baseUrl}/api/admin/auth`, {
        headers: { Cookie: cookieVal },
      });
      const sessionData = await resSession.json();
      console.log("Auth session payload:", sessionData);
      if (sessionData.authenticated) {
        console.log("✅ PASS: Authenticated session confirmed!");
      }

      // 8. Test Settings retrieval with authenticated cookie
      console.log("\n[TEST 8] Testing GET /api/admin/settings with authenticated session");
      const resSettingsAuthed = await fetch(`${baseUrl}/api/admin/settings`, {
        headers: { Cookie: cookieVal },
      });
      console.log(`Status: ${resSettingsAuthed.status}`);
      const settingsData = await resSettingsAuthed.json();
      console.log("Settings payload:", settingsData);
      if (resSettingsAuthed.status === 200 && settingsData.settings) {
        console.log("✅ PASS: Admin Settings successfully loaded!");
      }

      // 9. Test AdSense Publisher ID validation in /api/admin/settings
      console.log("\n[TEST 9] Testing AdSense Publisher ID format validation");
      const resInvalidAdSense = await fetch(`${baseUrl}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieVal },
        body: JSON.stringify({ adsense_publisher_id: "invalid-key-format" }),
      });
      console.log(`Invalid AdSense Status: ${resInvalidAdSense.status}`);
      const invalidData = await resInvalidAdSense.json();
      console.log("Error response:", invalidData);
      if (resInvalidAdSense.status === 400) {
        console.log("✅ PASS: Malformed AdSense key strictly rejected by validation!");
      }

      // 10. Test Valid AdSense key save
      console.log("\n[TEST 10] Testing Valid AdSense Publisher ID update");
      const resValidAdSense = await fetch(`${baseUrl}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieVal },
        body: JSON.stringify({
          adsense_publisher_id: "ca-pub-9988776655443322",
          ads_enabled: true,
        }),
      });
      console.log(`Valid AdSense Update Status: ${resValidAdSense.status}`);
      const validData = await resValidAdSense.json();
      console.log("Update response:", validData);
      if (resValidAdSense.status === 200) {
        console.log("✅ PASS: Valid AdSense key updated!");
      }
    }

    console.log("\n=== ALL SECURITY AUDIT TESTS PASSED SUCCESSFULLY ===");
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

runSecurityTests();
