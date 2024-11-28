import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const PageTransition = ({ children, type = "default" }) => {
    // Definindo as variantes de animação
    const variants = {
        default: {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 }
        },
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        slide: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
        }
    };

    const selectedVariant = variants[type] || variants.default;

    return (
        <motion.div
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            exit={selectedVariant.exit}
            transition={{ duration: 0.3 }}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        >
            {children}
        </motion.div>
    );
};

PageTransition.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['default', 'fade', 'slide'])
};

export default PageTransition;
