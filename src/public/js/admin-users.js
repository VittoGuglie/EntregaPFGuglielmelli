import EntityDAO from '../../dao/Entity.dao';

const Users = new EntityDAO('Users');

const runAdminTasks = async () => {
    const maxInactiveDays = 2;
    try {
        await Users.deleteInactiveUsers(maxInactiveDays);
        console.log('Usuarios inactivos eliminados correctamente');
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
    }

    const userIdToUpdate = 'your-user-id';
    const newRole = 'Premium';
    try {
        const updatedUser = await Users.updateRole(userIdToUpdate, newRole);
        console.log('Rol del usuario actualizado:', updatedUser);
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
    }

    const userIdToDelete = 'your-user-id';
    try {
        const deletedUser = await Users.deleteUser(userIdToDelete);
        console.log('Usuario eliminado:', deletedUser);
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}
runAdminTasks();