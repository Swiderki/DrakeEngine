import { Engine, Matrix, Vec3D, Vector } from ".";

describe('Line Visibility', () => {
    // Mock data for line segment, matrices, and frustum
    const line: [Vec3D, Vec3D] = [{ x: 0, y: 0, z: 10 }, { x: 0, y: 0, z: 10 }];
    // world matrix
    // const matWorld = Matrix.makeTranslation(0, 0, 0);
    
    // projection matrix
    const projectionMatrix = Matrix.zeros();
    Matrix.makeProjection(
        projectionMatrix,
        90,
        720 / 1280,
        .1,
        1000
    );
    
    // camera stuff
    const targetDir =  Vector.add(
        Vector.zero(),
        Vector.forward()
    );

    const matCamera = Matrix.lookAt(Vector.zero(), targetDir, {
        x: 0,
        y: 1,
        z: 0,
    });

    const matView = Matrix.quickInverse(matCamera);
    
    it('should correctly determine line visibility', () => {
        // const frustumPlanes = FlusterUtil.calculateViewFrustumPlanes(matView, projectionMatrix);
        // Call the function to check line visibility
        const visible = Engine.isLineVisible(line, matView, projectionMatrix);

        // Assert the expected visibility status
        expect(visible).toBe(true); // Example assertion for line visibility
        // Adjust the assertion based on your specific scenario
    });
});