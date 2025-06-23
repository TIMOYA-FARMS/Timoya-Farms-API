export const permissions = [
    {
        role: 'User',
        actions: [
            'viewProfile', 
            'updateProfile', 
            'viewProducts'
        ]
    },
    {
        role: 'Farmer',
        actions: [
            'viewProfile', 
            'updateProfile', 
            'manageCrops'
        ]
    },
    {
        role: 'Admin',
        actions: [
            'viewProfile', 
            'viewProfiles', 
            'updateProfile', 
            'updateProfiles', 
            'deleteProfile', 
            'createProduct',
            'updateProduct',
            'deleteProduct',
            'viewProducts',         
            'viewReports'
        ]
    }
]