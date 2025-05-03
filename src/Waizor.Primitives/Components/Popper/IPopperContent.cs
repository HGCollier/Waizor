using Waizor.Primitives.Enums;

namespace Waizor.Primitives.Components.Internal;

internal interface IPopperContent
{
    Side Side { get; set; }
    int SideOffset { get; set; }
    Align Align { get; set; }
    int AlignOffset { get; set; }
    int ArrowPadding { get; set; }
}
