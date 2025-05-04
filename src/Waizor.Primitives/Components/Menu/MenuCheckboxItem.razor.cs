using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuCheckboxItem : MenuItem
{
    [Parameter]
    public bool? DefaultChecked { get; set; } = false;

    [Parameter]
    public bool? Checked { get; set; } = null;

    [Parameter]
    public EventCallback<bool?> CheckedChanged { get; set; }

    public MenuItemIndicatorState State => GetState();

    private async Task OnSelectAsync()
    {
        if (!CheckedChanged.HasDelegate)
        {
            return;
        }

        Checked ??= false;
        Checked = !Checked;

        await CheckedChanged.InvokeAsync(Checked);
    }

    private MenuItemIndicatorState GetState()
    {
        if (!Checked.HasValue)
        {
            return MenuItemIndicatorState.Indeterminate;
        }

        if (Checked.Value)
        {
            return MenuItemIndicatorState.Checked;
        }

        return MenuItemIndicatorState.Unchecked;
    }

    protected override void OnInitialized()
    {
        if (!DefaultChecked.HasValue || Checked.HasValue)
        {
            return;
        }

        Checked = DefaultChecked;
    }
}
