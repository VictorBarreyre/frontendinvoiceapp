import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({

    breakpoints: {
        sm: '320px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
    },


    components: {
        Input: {
            baseStyle: {
                focusBorderColor: "green.400", // Couleur de la bordure lorsqu'en focus
            },
        },
    },
});

export default theme;
