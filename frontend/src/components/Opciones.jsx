import { Check } from "@mui/icons-material";
import { Checkbox, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

export default function Opciones({ group = null, onChange = null }) {

    return group != null &&
        <RadioGroup
            name={group.id}
            defaultValue={group.opciones[0]?.id}
            data-group={group.id}
            onChange={onChange}
        >
            <div className='d-flex flex-column align-items-end'>
                <legend className='card-text fw-bold fs-5'> {group.descripcion} </legend>
                {group.opciones.map(option => (
                    <FormControlLabel
                        key={option.id}
                        value={option.id}
                        label={option.display_string}
                        labelPlacement="start"
                        control={<Radio data-precio={option.precio} data-id={option.id} className="atomic-data" sx={{ padding: 0.5 }} />}
                    />
                ))}
            </div>
        </RadioGroup>
}