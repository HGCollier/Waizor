using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuRadioItem<T> : MenuItem
{
    [CascadingParameter]
    public required MenuRadioGroup<T> MenuRadioGroup { get; set; }

    [Parameter, EditorRequired]
    public required T Value { get; set; }

    public MenuItemIndicatorState State => GetState();

    private async Task OnSelectAsync() => await MenuRadioGroup.SetValueAsync(Value);

    private MenuItemIndicatorState GetState()
    {
        if (MenuRadioGroup.Value is null)
        {
            return MenuItemIndicatorState.Indeterminate;
        }

        if (MenuRadioGroup.Value.Equals(Value))
        {
            return MenuItemIndicatorState.Checked;
        }

        return MenuItemIndicatorState.Unchecked;
    }
}
