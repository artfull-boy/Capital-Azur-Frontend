import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"

/**
 * Normalize a JSONAPI response containing a three-column projects component.
 * @param {object} payload  The full JSON payload
 * @returns {object}         An object with page metadata and a list of project items
 */
export const normalizeProjects = (payload) => {
  // Top‑level page component
  const component     = get(payload, "components[0]", {})
  const pageTitle     = get(component, "title", null)
  const buttonLabel   = get(component, "link.title", null)
  const buttonUrl     = get(component, "link.url", null)

  // Project nodes & included terms/users
  const nodes    = get(component, "collection.data.data", [])
  const included = get(component, "collection.data.included", [])

  // Map each node into a flat project object
  const projects = nodes.map((node) => {
    const attrs = get(node, "attributes", {})
    const rels  = get(node, "relationships", {})

    // categories → array of names
    const categoryNames = (get(rels, "field_project_category.data", []) || [])
      .map(({ id, type }) => {
        const term = included.find((i) => i.type === type && i.id === id)
        return term && get(term, "attributes.name", null)
      })
      .filter(Boolean)

    // coordinator → just the name or fallback
    let coordinatorName = null
    const coordRel = get(rels, "field_project_coordinator.data", null)
    if (coordRel) {
      const user = included.find((i) => i.type === coordRel.type && i.id === coordRel.id)
      const target = get(coordRel, "meta.drupal_internal__target_id")
      coordinatorName = user
        ? get(user, "attributes.name", `User #${target}`)
        : `User #${target}`
    }

    return {
      id:          get(attrs, "drupal_internal__nid", null),
      title:       get(attrs, "field_project_name", null),
      description: stripHtml(get(attrs, "body.processed", "") || ""),
      deadline:    get(attrs, "field_project_deadline", null),
      category:    categoryNames.join(", "),
      coordinator: coordinatorName,
    }
  })

  // Return page metadata along with normalized projects
  return {
    pageTitle,
    buttonLabel,
    buttonUrl,
    projects,
  }
}
