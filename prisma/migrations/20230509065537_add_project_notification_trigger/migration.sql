-- Notifies when a project is created or updated and there is a duplicate
-- project name or description
CREATE OR REPLACE FUNCTION notify_project_duplicate()
RETURNS TRIGGER AS $$
DECLARE
  -- List of matching projects
  matching_projects JSON;
BEGIN
  SELECT json_agg(row_to_json("Project".*)) INTO matching_projects
  FROM "Project" WHERE (name = NEW.name OR description = NEW.description) AND id <> NEW.id;
  
  IF matching_projects IS NOT NULL THEN
    PERFORM pg_notify('project_match', matching_projects::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_duplicate_trigger
AFTER INSERT OR UPDATE ON "Project"
FOR EACH ROW
EXECUTE FUNCTION notify_project_duplicate();

