async function CreateCourse(courseData) {
    const token = localStorage.getItem("token");
    console.log("CreateCourse - Token:", token);
    console.log("CreateCourse - CourseData:", courseData);

    // Validar que el token existe
    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

        const response = await fetch('http://localhost:3000/api/cursos', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(courseData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log("CreateCourse - Response status:", response.status);
        console.log("CreateCourse - Response ok:", response.ok);

        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = "Error desconocido del servidor";
            }
            console.error("CreateCourse - Error response:", errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("CreateCourse - Success data:", data);
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("CreateCourse - Timeout");
            throw new Error("La petición tardó demasiado tiempo. Verifica que el servidor esté corriendo.");
        }
        console.error("CreateCourse - Exception:", error);
        throw error;
    }
}
export default CreateCourse;