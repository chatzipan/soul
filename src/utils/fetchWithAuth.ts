interface ApiError extends Error {
  response?: {
    status: number;
    data?: {
      code?: string;
      message?: string;
    };
  };
}

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error() as ApiError;
    error.response = {
      status: res.status,
      data: errorData,
    };
    throw error;
  }

  return res.json();
};
