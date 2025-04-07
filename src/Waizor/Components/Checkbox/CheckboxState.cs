namespace Waizor.Components;

[Flags]
public enum CheckboxState
{
    None = 0,
    Checked = 1,
    Disabled = 2,
    ReadOnly = 4,
    Required = 8,
    Indeterminate = 16
}
