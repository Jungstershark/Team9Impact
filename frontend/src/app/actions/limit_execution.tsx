import { EXECUTION_API_PREFIX } from '../constants';

// this should be in real time; edit to get data using real time api
//return all tables that are in the same instrument group, and have avail_limit>limit
export async function getAllLimits() {
    // Validate form fields
    try {
        // Make a GET request to the limits API endpoint
        const response = await fetch(`${EXECUTION_API_PREFIX}/limits`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        console.log(response);

        // Check if the response is not OK (status not in the range 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            return { errors: errorData.errors || { general: 'Failed to obtain data.' } };
        }

        // Successful signup response
        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        // Handle network or other errors
        console.error('Database error:', error);
        return { errors: { general: 'An error occurred when getting data. Please try again.' } };
    }
}

export async function getLimitsHigherThanTotal(limit: number) {
    // Validate form fields
    try {
        // Make a GET request to the limits API endpoint
        const response = await fetch(`${EXECUTION_API_PREFIX}/limits/filter?limithigher=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        console.log(response);

        // Check if the response is not OK (status not in the range 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            return { errors: errorData.errors || { general: 'Failed to obtain data.' } };
        }

        // Successful signup response
        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        // Handle network or other errors
        console.error('Database error:', error);
        return { errors: { general: 'An error occurred when getting data. Please try again.' } };
    }
}

export async function getLimitTable(formData: FormData) {
    // Validate form fields
    const payload = {
        "instrumentGroup": formData.get('firstname'),
        "limit": formData.get('lastName'),
    }

    try {
        // Make a POST request to the signup API endpoint
        const response = await fetch(`${EXECUTION_API_PREFIX}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(payload),
            redirect: "follow"
        });

        console.log(response);

        // Check if the response is not OK (status not in the range 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            return { errors: errorData.errors || { general: 'Failed to obtain data.' } };
        }

        // Successful signup response
        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        // Handle network or other errors
        console.error('Database filter error:', error);
        return { errors: { general: 'An error occurred when getting data. Please try again.' } };
    }
}


export async function submitTrade(limit:number, limitId:string) {
    // Validate form fields
    const payload = {
        "id": limitId,
        "amount": limit,
    }

    try {
        // Make a POST request to the signup API endpoint
        const response = await fetch(`${EXECUTION_API_PREFIX}/limits/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(payload),
            redirect: "follow"
        });

        console.log(response);

        // Check if the response is not OK (status not in the range 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            return { errors: errorData.errors || { general: 'Limit Exceeded' } };
        }

        // Successful signup response
        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        // Handle network or other errors
        console.error('Database filter error:', error);
        return { errors: { general: 'An error occurred when getting data. Please try again.' } };
    }
}