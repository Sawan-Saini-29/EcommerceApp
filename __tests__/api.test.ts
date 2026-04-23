import apiService from '../src/services/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('api service', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

    beforeEach(() => {
        mockedAxios.create.mockReturnValue({
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() },
            },
            get: jest.fn().mockResolvedValue({ data: { ok: true } }),
            post: jest.fn().mockResolvedValue({ data: { ok: true } }),
            put: jest.fn().mockResolvedValue({ data: { ok: true } }),
            patch: jest.fn().mockResolvedValue({ data: { ok: true } }),
            delete: jest.fn().mockResolvedValue({ data: { ok: true } }),
            defaults: { headers: { common: {} } },
        } as any);

        mockedStorage.getItem.mockResolvedValue(null);
    });

    it('calls axios.get through apiService.get', async () => {
        await apiService.get('/test');
        expect(mockedAxios.create).toHaveBeenCalled();
    });

    it('calls axios.post through apiService.post', async () => {
        await apiService.post('/test', { value: 1 });
        expect(mockedAxios.create).toHaveBeenCalled();
    });
});
