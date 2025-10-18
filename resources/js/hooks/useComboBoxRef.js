import { useRef, useCallback, useEffect } from 'react';

// Custom hook untuk handle ComboBox dengan ref
const useComboBoxRef = (initialValue = null) => {
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const comboBoxRef = useRef(null);

    // Function untuk update value dari external
    const setValue = useCallback((value) => {
        setSelectedValue(value);
        // Update ref value juga
        if (comboBoxRef.current) {
            comboBoxRef.current.value = value;
        }
    }, []);

    // Effect untuk sync ref dengan state
    useEffect(() => {
        if (comboBoxRef.current) {
            comboBoxRef.current.value = selectedValue;
        }
    }, [selectedValue]);

    return {
        selectedValue,
        setValue,
        comboBoxRef
    };
};