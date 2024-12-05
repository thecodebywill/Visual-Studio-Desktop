document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const form = document.getElementById('updateProfileForm');

    if (!token) {
        alert('No token found. Redirecting to login page.');
        window.location.href = 'login.html'; // Redirect to login if token is not found
        return;
    }

    // Fetch current user details
    fetch('http://127.0.0.1:5000/user_details', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('User details fetched:', data);
        if (data.error) {
            alert(data.error);
        } else {
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('walletAddress').value = data.walletAddress || '';
            document.getElementById('idNumber').value = data.idNumber || '';
        }
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
        alert('An error occurred while fetching user details.');
    });

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const jsonData = {
            phone: formData.get('phone') || '',
            walletAddress: formData.get('walletAddress') || '',
            idNumber: formData.get('idNumber') || '',
        };

        console.log('Form data to be submitted:', jsonData);

        fetch('http://127.0.0.1:5000/update_user_details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from update:', data);
            if (data.error) {
                alert(data.error);
            } else {
                alert('Profile updated successfully');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        });
    });
});
