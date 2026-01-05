import { PRIMARY_KEY_COLUMN } from '../types';

const PROD_HOST = 'https://n-api-gamma.vercel.app';
// const LOCAL_HOST = 'http://localhost:8081'; 
const MAIN_HOST = PROD_HOST; // Defaulting to prod as per script
const SHEET_NAME = 'F3';

const BATCH_UPDATE_API_URL = `${MAIN_HOST}/sheet/${SHEET_NAME}/update?verbose=true`;
const SINGLE_UPDATE_API_URL = `${MAIN_HOST}/sheet/${SHEET_NAME}/update-single`;
const TRANSFER_API_URL = `${MAIN_HOST}/sheet/MGT nội bộ/rows/batch`;
const MGT_NOI_BO_ORDER_API_URL = `${MAIN_HOST}/sheet/MGT nội bộ/data`;
const DATA_API_URL = `${MAIN_HOST}/sheet/${SHEET_NAME}/data`;

export const fetchOrders = async () => {
    try {
        console.log('Fetching data from:', DATA_API_URL);

        const response = await fetch(DATA_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API Error ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        console.log('API Response:', json);

        if (json.error) throw new Error(json.error);

        const data = json.rows || json.data || json;
        if (!Array.isArray(data)) {
            console.error('Invalid data format:', data);
            throw new Error('Dữ liệu trả về không đúng định dạng mảng');
        }

        console.log(`Loaded ${data.length} orders`);
        return data;

    } catch (error) {
        console.error('fetchOrders error:', error);

        // Fallback với dữ liệu demo nếu API lỗi
        console.log('Using fallback demo data...');
        return [
            {
                "Mã đơn hàng": "DEMO001",
                "Name*": "Nguyễn Văn A",
                "Phone*": "0123456789",
                "Add": "123 Đường ABC",
                "City": "Hà Nội",
                "State": "Hà Nội",
                "Khu vực": "Miền Bắc",
                "Mặt hàng": "Sản phẩm A",
                "Giá bán": "1000000",
                "Tổng tiền VNĐ": "1000000",
                "Ghi chú": "Đơn hàng demo",
                "Trạng thái giao hàng": "ĐANG GIAO",
                "Mã Tracking": "",
                "Ngày lên đơn": new Date().toISOString(),
                "Ngày đóng hàng": ""
            },
            {
                "Mã đơn hàng": "DEMO002",
                "Name*": "Trần Thị B",
                "Phone*": "0987654321",
                "Add": "456 Đường XYZ",
                "City": "TP.HCM",
                "State": "TP.HCM",
                "Khu vực": "Miền Nam",
                "Mặt hàng": "Sản phẩm B",
                "Giá bán": "2000000",
                "Tổng tiền VNĐ": "2000000",
                "Ghi chú": "Đơn hàng demo 2",
                "Trạng thái giao hàng": "ĐÃ GIAO",
                "Mã Tracking": "VN123456789",
                "Ngày lên đơn": new Date().toISOString(),
                "Ngày đóng hàng": new Date().toISOString()
            }
        ];
    }
};

export const updateSingleCell = async (orderId, columnKey, newValue) => {
    const payload = { [PRIMARY_KEY_COLUMN]: orderId, [columnKey]: newValue };
    const response = await fetch(SINGLE_UPDATE_API_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

export const fetchMGTNoiBoOrders = async () => {
    try {
        const response = await fetch(MGT_NOI_BO_ORDER_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        if (json.data && Array.isArray(json.data)) {
            return json.data.map((row) => row[PRIMARY_KEY_COLUMN]).filter(Boolean);
        }
        return [];
    } catch (error) {
        console.error('fetchMGTNoiBoOrders error:', error);
        return [];
    }
};

export const fetchFFMOrders = async () => {
    try {
        const FFM_DATA_API_URL = `${MAIN_HOST}/sheet/FFM/data`;
        console.log('Fetching FFM data from:', FFM_DATA_API_URL);

        const response = await fetch(FFM_DATA_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('FFM Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('FFM API Error Response:', errorText);
            throw new Error(`API Error ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        console.log('FFM API Response:', json);

        if (json.error) throw new Error(json.error);

        const data = json.rows || json.data || json;
        if (!Array.isArray(data)) {
            console.error('Invalid FFM data format:', data);
            throw new Error('Dữ liệu FFM trả về không đúng định dạng mảng');
        }

        console.log(`Loaded ${data.length} FFM orders`);
        return data;

    } catch (error) {
        console.error('fetchFFMOrders error:', error);

        // Fallback với dữ liệu demo nếu API lỗi
        console.log('Using fallback demo data for FFM...');
        return [
            {
                "Mã đơn hàng": "FFM001",
                "Name*": "Nguyễn Văn C",
                "Phone*": "0912345678",
                "Add": "789 Đường FFM",
                "City": "Hà Nội",
                "State": "Hà Nội",
                "Khu vực": "Miền Bắc",
                "Mặt hàng": "Sản phẩm FFM",
                "Giá bán": "1500000",
                "Tổng tiền VNĐ": "1500000",
                "Ghi chú": "Đơn hàng FFM demo",
                "Trạng thái giao hàng": "ĐANG GIAO",
                "Mã Tracking": "",
                "Ngày lên đơn": new Date().toISOString(),
                "Ngày đóng hàng": ""
            }
        ];
    }
};

export const updateBatch = async (rows) => {
    const response = await fetch(BATCH_UPDATE_API_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
};
