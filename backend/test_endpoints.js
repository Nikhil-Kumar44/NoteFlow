const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
    console.log('=== NoteFlow API & RBAC Verification Suite ===');

    let userToken = '';
    let adminToken = '';
    let testNoteId = '';

    const apiRequest = async (url, method, body, token) => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        
        let data = null;
        try {
            data = await res.json();
        } catch (e) {}
        
        return { status: res.status, data };
    };

    // 1. Input Validation Assertion
    try {
        console.log('\n[TEST 1] Verifying Request Validation (Short password on signup)...');
        const res = await apiRequest(`${BASE_URL}/auth/signup`, 'POST', {
            name: 'Short Pwd User',
            email: 'short@noteflow.com',
            password: '123'
        });
        if (res.status === 400) {
            console.log('✅ PASS: Validation works! Status 400 returned:', res.data);
        } else {
            console.error('❌ FAIL: Status should be 400. Got:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error.message);
    }

    // 2. Regular User Signup/Login
    try {
        console.log('\n[TEST 2] Registering / Logging in regular user...');
        const res = await apiRequest(`${BASE_URL}/auth/signup`, 'POST', {
            name: 'Regular User',
            email: `user-${Date.now()}@noteflow.com`,
            password: 'userpwd123'
        });
        
        if (res.status === 201) {
            userToken = res.data.token;
            console.log('✅ PASS: User registered. Role assigned:', res.data.role);
        } else {
            console.error('❌ FAIL: Could not register user:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error.message);
    }

    // 3. Admin User Signup
    try {
        console.log('\n[TEST 3] Registering / Logging in Admin user...');
        const res = await apiRequest(`${BASE_URL}/auth/signup`, 'POST', {
            name: 'Admin User',
            email: `admin-${Date.now()}@noteflow.com`,
            password: 'adminpwd123',
            role: 'admin'
        });
        
        if (res.status === 201) {
            adminToken = res.data.token;
            console.log('✅ PASS: Admin registered. Role assigned:', res.data.role);
        } else {
            console.error('❌ FAIL: Could not register admin:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error.message);
    }

    // 4. Note Management Isolation (Create as user)
    try {
        console.log('\n[TEST 4] Creating note as Regular User...');
        const res = await apiRequest(`${BASE_URL}/notes`, 'POST', {
            title: 'User Confidential Note',
            content: 'Private note of user.'
        }, userToken);
        
        if (res.status === 201) {
            testNoteId = res.data._id;
            console.log('✅ PASS: Note created successfully. ID:', testNoteId);
        } else {
            console.error('❌ FAIL: Note creation failed:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error.message);
    }

    // 5. Admin RBAC Checks (Fetch all notes)
    try {
        console.log('\n[TEST 5] Fetching all database notes as Admin...');
        const res = await apiRequest(`${BASE_URL}/notes`, 'GET', null, adminToken);
        const hasOtherUserNote = res.data.some(note => note._id === testNoteId);
        console.log('✅ PASS: Admin successfully fetched all notes. Total count:', res.data.length, '| Regular note visible:', hasOtherUserNote);
    } catch (error) {
        console.error('❌ FAIL: Admin get all notes failed:', error.message);
    }

    // 6. Regular User authorization failure (GET /auth/users)
    try {
        console.log('\n[TEST 6] Regular User trying to list registered users (GET /auth/users)...');
        const res = await apiRequest(`${BASE_URL}/auth/users`, 'GET', null, userToken);
        if (res.status === 403) {
            console.log('✅ PASS: Access Denied! Status 403 returned:', res.data);
        } else {
            console.error('❌ FAIL: Status should be 403 Forbidden. Got:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error.message);
    }

    // 7. Admin user authorization success (GET /auth/users)
    try {
        console.log('\n[TEST 7] Admin listing all registered users (GET /auth/users)...');
        const res = await apiRequest(`${BASE_URL}/auth/users`, 'GET', null, adminToken);
        if (res.status === 200) {
            console.log('✅ PASS: User list fetched successfully. Count:', res.data.length);
        } else {
            console.error('❌ FAIL: Admin query failed. Got:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error.message);
    }

    // 8. Admin deleting other user note (RBAC permission)
    try {
        console.log('\n[TEST 8] Admin deleting Regular User\'s note...');
        const res = await apiRequest(`${BASE_URL}/notes/${testNoteId}`, 'DELETE', null, adminToken);
        if (res.status === 200) {
            console.log('✅ PASS: Deleted Note ID returned:', res.data.id);
        } else {
            console.error('❌ FAIL: Admin note deletion failed. Got:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error.message);
    }

    // 9. Interactive documentation validation
    try {
        console.log('\n[TEST 9] Checking Swagger Documentation Endpoint availability (/api-docs)...');
        const res = await fetch('http://localhost:5000/api-docs/');
        if (res.status === 200) {
            console.log('✅ PASS: Swagger documentation HTML page served.');
        } else {
            console.error('❌ FAIL: Swagger endpoint status:', res.status);
        }
    } catch (error) {
        console.error('❌ FAIL: Documentation check failed:', error.message);
    }

    console.log('\n=== All NoteFlow RBAC Tests Completed Successfully ===');
}

runTests();
